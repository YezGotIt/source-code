# Modules
from selenium import  webdriver
from threading import Thread
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time , re, sys, xlsxwriter, argparse, validators

# Youtube class
class YouTube:
    # Initial values
    def __init__(self, url):
        self.url = url
        self.turl = ""
        self.list = []
        self.channelInfo = {}
        self.uniqueYoutube = set()
        self.count = 0
        self.match = False
        self.refernce_info = ""
        self.refernce_title = ""
    
    # Checking the youtube name only.
    def check_url(self, url):
        for x in url.split("/"):
            if x.startswith("www.") or x.endswith(".com"):
                print(x)
                return x
    
    # Checking the youtube domain only.
    def matchYoutube(self, url):
        array = self.check_url(url).split(".")
        match = len(array)
        count = 0
        pattern = '^youtube$'
        for x in array:
            result = re.match(pattern, x.lower())
            
            if result:
                return True
            else:
                if match == count:
                    return False
                else:
                    count += 1
    
    # Checking the channel URL it's has videos or not
    def check_yt_link(self):
        if validators.url(self.url):
            if self.matchYoutube(self.url):
                if self.url.endswith("/videos"):
                    self.url = "{}".format(self.url)
                elif "/watch?v=" in self.url:
                    print("[-] This is a not channel link")
                    sys.exit(1)  
                elif self.url.endswith("/featured"):
                     self.url = self.url.replace("featured","videos")
                elif self.url.endswith("/playlists"):
                     self.url = self.url.replace("playlists","videos")
                elif self.url.endswith("/channels"):
                     self.url = self.url.replace("channels","videos")
                elif self.url.endswith("/about"):
                     self.url = self.url.replace("about","videos")
                elif self.url.endswith("/community"):
                     self.url = self.url.replace("community","videos")
                elif self.url.endswith("/store"):
                     self.url = self.url.replace("store","videos")
                elif self.url.endswith("/"):
                    self.url  = "{}videos".format(self.url)                                    
                else:
                    self.url  = "{}/videos".format(self.url)
                self.turl = self.url    
                self.start()    
            else:
                print("[-] It must be youtube link")
                sys.exit(1)
        else:
            print("[-] Not a valid link")
            sys.exit(1)

    # scrolling the page 
    def scroll_collect_info(self, driver):
        try:
            main = driver.find_element_by_xpath('//*[@id="contents"]/ytd-item-section-renderer')
            contents = main.find_element_by_id('contents')
            contents = contents.find_element_by_xpath('//*[@id="contents"]/ytd-grid-renderer')
            items = contents.find_element_by_id('items')
            tags = items.find_elements_by_tag_name('ytd-grid-video-renderer')
            for item in tags:
                videoMeta = item.find_element_by_id("video-title")
                info = videoMeta.get_attribute('aria-label')
                title = videoMeta.get_attribute('title')
                if self.refernce_info == info and self.refernce_title == title:
                    print("[+] Scroll is over")
                    self.match = True       
        except Exception as e:
            print("Error")
            print(e)

    # Getting the refernce point  
    def get_refernce_point(self, driver):
        data = driver.find_element_by_css_selector("#items > ytd-grid-video-renderer:nth-child(1)")
        videoMeta = data.find_element_by_id("video-title")
        self.refernce_info = videoMeta.get_attribute('aria-label')
        self.refernce_title = videoMeta.get_attribute('title')

    # Getting the content from driver to covert into lxml    
    def get_content_html(self, driver):
        print("[+] gathering information from the channel videos")
        content = driver.page_source.encode('utf-8').strip()
        soup = BeautifulSoup(content, 'lxml')
        metaData = soup.findAll("a", id="video-title")
        count = 1
        for meta in metaData:
            title = meta.get("title")
            link = "https://www.youtube.com{}".format(meta.get("href"))
            data = {"no":count ,"title": title, "link": link}
            self.list.append(data)
            count += 1
        print("[+] Creating the file") 
        self.createExcel()   

    # Creating the excel file
    def createExcel(self):
        fileName = "{}-videos-list.xlsx".format(self.channelInfo["name"])
        workbook = xlsxwriter.Workbook(fileName)
        worksheet = workbook.add_worksheet()
        header = ["No of video", "title", "link"]
        row = 0
        col = 0
        for i in header:
            worksheet.write(row,col, i)
            col += 1
        row = 1
        col = 0
        for data in self.list:
            worksheet.write(row, col, data["no"])
            worksheet.write(row, col + 1, data["title"])
            worksheet.write(row, col + 2, data["link"])
            row +=1
        workbook.close()
        print("[+] File Name is {}".format(fileName))

    # Channel about page
    def get_about_the_channel(self, driver):
        channelName = driver.find_element_by_css_selector("#channel-name")
        channelJoindDate = driver.find_element_by_css_selector("#right-column > yt-formatted-string:nth-child(2)")
        self.channelInfo  = {
        "name":channelName.text,
        "date":channelJoindDate.text,
        }

    # Channel info text file
    def createTxt(self):
        lineTxt = [
        "Channel URL : Nil \n\n",
        "Channel ID : Nil \n\n",
        "Adsense publisher ID : Nil \n\n", 
        "Email ID : Nil \n\n",
        "Email createdAt : Nil \n\n",  
        "Channel name : {} \n\n".format(self.channelInfo["name"]),
        "Channel Joined : {} \n\n".format(self.channelInfo["date"])
        ]
        fileName = "{}-channel-info.txt".format(self.channelInfo["name"])
        with open(fileName, "w", encoding="utf-8") as f:
            f.writelines(lineTxt)
        print("[+] channel info create {}".format(fileName))

    # checking the refernce point
    def refernce_the_refernce_point(self):
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        driver.get(self.turl)
        time.sleep(2)
        self.get_refernce_point(driver)
        driver.close()

    # start the process
    def start(self):
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        print("[+] Getting info on channel...")
        driver.get(self.url.replace("videos", "about"))
        time.sleep(2)
        self.get_about_the_channel(driver)
        self.createTxt()
        driver.get(self.url)
        print("[+] Getting the refernce...")
        time.sleep(3)
        self.get_refernce_point(driver) 
        driver.get("{}?view=0&sort=da&flow=grid".format(self.url))
        time.sleep(3)
        
        while (self.match==False):
            js = "window.scrollBy(0, 2500);"
            driver.execute_script(js)
            self.count += 1
            print("[+] {} scroll".format(self.count))
            if self.count % 5 == 0:
                t = Thread(target = self.refernce_the_refernce_point(), args =( ), daemon = True)
                t.start()
            time.sleep(2)
            self.scroll_collect_info(driver) 

        self.get_content_html(driver) 
        print("[+] Done")

    # Delete the initial values            
    def __del__(self):
        pass    
        
parser = argparse.ArgumentParser(description="For creators")
parser.add_argument("-l", "--link", required=True, help="Youtube channel link")
args = vars(parser.parse_args())

# checking the main class
if __name__=="__main__":
    start = YouTube(args["link"])
    start.check_yt_link()          