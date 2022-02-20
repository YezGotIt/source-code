# Modules
from selenium import  webdriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time , re, sys, xlsxwriter, argparse, validators, urllib

# Youtube class
class YouTube:
    # Initial values
    def __init__(self, url, advanced):
        self.url = url
        self.list = []
        self.channelInfo = {}
        self.advanced = advanced
        self.count = 0
        self.match = False

    # Checking the youtube name only.
    def check_url(self, url):
        for x in url.split("/"):
            if x.startswith("www.") or x.endswith(".com"):
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

    # Getting the content from driver to covert into lxml  
    def get_content_html(self, driver):
        print("[+] gathering information of the channel videos")
        content = driver.page_source.encode('utf-8').strip()
        time.sleep(1)
        soup = BeautifulSoup(content, 'lxml')
        metaData = soup.findAll("a", id="video-title")
        durations = soup.findAll("span", id="text")
        count = 1
        for meta, duration in zip(metaData, durations):
            title = meta.get("title")
            link = "https://www.youtube.com{}".format(meta.get("href"))
            others = meta.get("aria-label")
            duration = duration.get("aria-label")
            views = others.split(" ")[-2]
            isStreamed = ""
            if "Streamed" in others:
                isStreamed = "Streamed"   
            else:
                isStreamed = "Not Streamed"
            gg = re.findall(r'(\d{1,}\s*(years|year|months|month|weeks|week|days|day|hours|hour|minutes|minuter|seconds|second))', others)
            partialDate = ",".join([i[0] for i in gg]) 
            if self.advanced:
                data = {"no":count ,"title": title, "link": link, "views": views, "isStreamed": isStreamed, "date": partialDate, "duration": duration }
            else:
                data = {"no":count ,"title": title, "link": link }
            self.list.append(data)
            count += 1
        else:    
            print("[+] Creating the file") 
            self.createExcel()

    # Creating the excel file
    def createExcel(self):
        fileName = "{}-videos-list.xlsx".format(self.channelInfo["name"])
        workbook = xlsxwriter.Workbook(fileName)
        worksheet = workbook.add_worksheet()

        if self.advanced:
            header = ["No of video", "Title", "Link", "Views", "isStreamed", "Relative time", "Duration"]
        else:
            header = ["No of video", "Title", "Link"]
        
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
            if self.advanced:
                worksheet.write(row, col + 3, data["views"])
                worksheet.write(row, col + 4, data["isStreamed"])
                worksheet.write(row, col + 5, data["date"])
                worksheet.write(row, col + 6, data["duration"])

            row +=1
        workbook.close()
        print("[+] File Name is {}".format(fileName))

    # Covert the url to proper format
    def convert_yt_about_page_url(self, url):
        return urllib.parse.unquote(url.split("q=")[-1])

    # Channel about page
    def get_about_the_channel(self, driver):
        channelName = driver.find_element_by_css_selector("#channel-name")
        channelJoindDate = driver.find_element_by_css_selector("#right-column > yt-formatted-string:nth-child(2)")
        totalViews = driver.find_element_by_css_selector("#right-column > yt-formatted-string:nth-child(3)")
        channelDescription = driver.find_element_by_css_selector("#description-container")
        channelLocation = driver.find_element_by_css_selector("#details-container > table > tbody > tr:nth-child(2) > td:nth-child(2)")
        channelSubscribe = driver.find_element_by_css_selector("#inner-header-container > #meta > yt-formatted-string").get_attribute('aria-label')
        try:
            channelBadge = driver.find_element_by_css_selector("#inner-header-container > #meta > #channel-name > ytd-badge-supported-renderer > div").get_attribute('aria-label')
        except:
            channelBadge = "Not Verified"
        channelLinks = driver.find_element_by_css_selector("#link-list-container")
        channelLinks = channelLinks.find_elements_by_tag_name("a")
        channelLinks = [{"link": self.convert_yt_about_page_url(a.get_attribute("href")), "text": a.text} for a in channelLinks]
        channelLinks =  "\n\n\t\t".join([str("{} : {}".format(i['text'], i['link'])) for i in channelLinks])
        self.channelInfo  = {
        "name":channelName.text,
        "date":channelJoindDate.text,
        "badge":channelBadge,
        "total subscribers":channelSubscribe,
        "views":totalViews.text,
        "description":"\n\n=========================\n{}\n\n=========================".format(channelDescription.text),
        "location":channelLocation.text,
        "links": channelLinks
        }

    # Channel info text file
    def createTxt(self):
        if self.advanced:
            lineTxt = [
        "Channel URL : Nil \n\n",
        "Channel ID : Nil \n\n",
        "Adsense ID : Nil \n\n", 
        "Email ID : Nil \n\n",
        "Email createdAt : Nil \n\n",  
        "Channel name : {} \n\n".format(self.channelInfo["name"]),
        "Channel joined : {} \n\n".format(self.channelInfo["date"]),
        "Channel badge status: {} \n\n".format(self.channelInfo["badge"]),
        "Channel subscribers : {} \n\n".format(self.channelInfo["total subscribers"]),
        "Channel total views : {} \n\n".format(self.channelInfo["views"]),
        "Channel description : {} \n\n".format(self.channelInfo["description"]),
        "Channel location : {} \n\n".format(self.channelInfo["location"]),
        "Channel links : {} \n\n".format(self.channelInfo["links"])
        ]
        else:
            lineTxt = [
        "Channel URL : Nil \n\n",
        "Channel ID : Nil \n\n",
        "Adsense ID : Nil \n\n", 
        "Email ID : Nil \n\n",
        "Email createdAt : Nil \n\n",  
        "Channel name : {} \n\n".format(self.channelInfo["name"]),
        "Channel joined : {} \n\n".format(self.channelInfo["date"])
        ]
        
        fileName = "{}-channel-info.txt".format(self.channelInfo["name"])
        with open(fileName, "w", encoding="utf-8") as f:
            f.writelines(lineTxt)
        print("[+] channel info create {}".format(fileName))

    # start the process
    def start(self):
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        driver.maximize_window()
        print("[+] Getting info on channel...")
        driver.get(self.url.replace("videos", "about"))
        time.sleep(2)
        self.get_about_the_channel(driver)
        self.createTxt()
        driver.get("{}?view=0&sort=da&flow=grid".format(self.url)) 

        height = driver.execute_script("return document.documentElement.scrollHeight")
        lastheight = 0
        while (self.match == False):
            if lastheight == height:
                print("[+] scroll to the end")
                self.match = True
            lastheight = height
            driver.execute_script("window.scrollTo(0, " + str(height) + ");")
            time.sleep(2)
            height = driver.execute_script("return document.documentElement.scrollHeight")
        self.get_content_html(driver) 
        print("[+] Done") 
        driver.close() 

    # Delete the initial values            
    def __del__(self):
        pass 

parser = argparse.ArgumentParser(description="For creators")
parser.add_argument("-l", "--link", required=True, help="Youtube channel link")
parser.add_argument("-a", "--full", default="No", help="Scarpe in advance mode. By default is No")
args = vars(parser.parse_args())

# checking the main class
if __name__=="__main__":
    advanced = False
    if args["full"].lower() == "yes":
        advanced = True
    print("[+] Advanced mode : {}".format(advanced))
    start = YouTube(args["link"], advanced)
    start.check_yt_link()