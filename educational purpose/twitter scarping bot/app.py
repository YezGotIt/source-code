# Modules
from selenium import  webdriver
from webdriver_manager.chrome import ChromeDriverManager
import time , re, sys, xlsxwriter, csv, argparse
from datetime import datetime 
from dateutil import parser

# Twitter class
class Twitter:
    # Initial
    def __init__(self, name, end, start, mode):
        self.posts = []
        self.name = name
        self.end = end
        self.start = start
        self.uniqueTweet = set()
        self.data = []
        self.attempt = 0
        self.mode = mode
    
    # Scarping the data and check it
    def getInfo(self, card, end, start):
        userName = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[1]/div/div/div[1]/div[1]/a/div/div[2]').text
        print(userName)
        date = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[1]/div/div/div[1]/a/time').get_attribute("datetime")
        print(date)
        checkDate = self.getTimes(date)
        if start <= checkDate and end >= checkDate and userName == "@{}".format(self.name):
            print("going in")
            comment = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[2]/div[1]').text
            responding = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[2]/div[2]').text
            link = ""
            if not responding:
                try:
                    link = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[2]/div[2]/div//div/div/div/a/div/div[2]/div/img').get_attribute('src')
                except:
                    pass
            texts = comment + responding + link
            print(texts)
            commentCount = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[2]/div[3]/div/div[1]').text
            retweetCount = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[2]/div[3]/div/div[2]').text
            likeCount = card.find_element_by_xpath('./div/div[1]/div/div[2]/div[2]/div[2]/div[3]/div/div[3]').text
            isTweet = "No"
            if retweetCount:
                isTweet = "Yes"
            dateNormal = self.getDate(date)
            data = ("{}---{}".format(date,userName),dateNormal,texts,isTweet,commentCount,retweetCount,likeCount)
            print(data)
            return data
        elif start >= checkDate and userName == "@{}".format(self.name):
            if self.attempt == 10:
                print("[+] Scarping is over.:)")
                self.display()
                sys.exit()
            else:
                print(self.getDate(date))
                self.attempt += 1
        else:
            return ""
    
    # Creating the file in excel
    def createExcel(self):
        fileName = "{}-Tweet {} to {}.xlsx".format(self.name,self.end, self.start) 
        workbook = xlsxwriter.Workbook(fileName)
        worksheet = workbook.add_worksheet()
        header = ["Tweet Id", "Tweet Date", "Tweet Text", "Retweet","Comment Count", "Retweet Count", "Like count"]
        row = 0
        col = 0
        for i in header:
            worksheet.write(row,col, i)
            col += 1
        row = 1
        col = 0
        for index, tuple in enumerate(self.data):
            worksheet.write(row, col, tuple[0])
            worksheet.write(row, col + 1, tuple[1])
            worksheet.write(row, col + 2, tuple[2])
            worksheet.write(row, col + 3, tuple[3])
            worksheet.write(row, col + 4, tuple[4])
            worksheet.write(row, col + 5, tuple[5])
            worksheet.write(row, col + 6, tuple[6])
            row +=1
        workbook.close()
        print("[+] File Name is {}".format(fileName)) 
        return
    
    # Creating the file in csv
    def createCsv(self):
        fileName = "{}-Tweet {} to {}.csv".format(self.name,self.end, self.start) 
        with open(fileName,'w', newline="" ,encoding="utf8") as f:
            header =  ["Tweet Id", "Tweet Date", "Tweet Text", "Retweet","Comment Count", "Retweet Count", "Like count"]
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerows(self.data)
        print("[+] File Name is {}".format(fileName))    
    
    # Display the message
    def display(self):
        message = "[+] Total Tweet By {} is : {}".format(self.name, str(len(self.data)))
        print(message)
        if self.mode == "excel":
            self.createExcel()
        if self.mode == "csv":
            self.createCsv()
        if self.mode == "both":
            self.createExcel()
            self.createCsv()
        return        
    
    # Collect the article
    def collectData(self, driver):
        end = self.getTimes(self.end)
        start = self.getTimes(self.start)
        cards = driver.find_elements_by_xpath('//article[@data-testid="tweet"]')
        for card in cards:
            text = self.getInfo(card,end,start)
            if text:
                tweet_id = "".join(text)
                if tweet_id not in self.uniqueTweet:
                    self.uniqueTweet.add(tweet_id)
                    self.data.append(text)
        return            

    # This function get the time
    def getTimes(self, info):
        datetime_obj = parser.parse(info)
        gmt = datetime.timestamp(datetime_obj)
        return gmt
    
    # This function get the date
    def getDate(self, info):
        datetime_obj= parser.parse(info)
        date = "{}-{}-{}".format(datetime_obj.year,datetime_obj.month,datetime_obj.day)
        return date
    
    # This start the driver
    def startProcess(self):
        url = "https://twitter.com/{}".format(self.name)
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        driver.get(url) 
        print("[+] Waiting for 5 second to initial the page...")
        time.sleep(5)
        self.collectData(driver)
        time.sleep(2)
        while True:
            js = "window.scrollBy(0, 1500);"
            self.collectData(driver)
            driver.execute_script(js)
            time.sleep(3)        


#  This will get command line arguments
ap = argparse.ArgumentParser()
ap.add_argument("-n", "--name", required=True, help="Twitter Account Name.")
ap.add_argument("-s", "--start", required=True, help="This format [2021-04-21]")
ap.add_argument("-e", "--end", required=True, help="This format [2021-04-21]")
ap.add_argument("-m", "--mode", required=False, default="csv", help="Type excel || csv || both")
args = vars(ap.parse_args())

# This will check the date format
x = re.search("^\d{4}-\d{2}-\d{2}$", args["end"])
y = re.search("^\d{4}-\d{2}-\d{2}$", args["start"])


if x and y:
    start = Twitter(args["name"],args["end"],args["start"], args["mode"])
    start.startProcess()
else:
    print("[-] Date Invalid")
