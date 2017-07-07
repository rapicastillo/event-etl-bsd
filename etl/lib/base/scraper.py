# encoding=utf8

import abc

class Scraper(object):
    __metaclass__  = abc.ABCMeta
    
    def __init__(self):
        self.minified_data = None
        self.osdified_data = None

    def get_data(self):
        return self.minified_data
        
    def get_osdi_data(self):
        return self.osdified_data
        

    @classmethod
    @abc.abstractmethod    
    def run(self):
        """
        This orchestrates the various methods
        """

    @classmethod
    @abc.abstractmethod    
    def retrieve(self):
        """
        This is where the items will be processed
        by getting the data out
        """
            
    @classmethod
    @abc.abstractmethod    
    def clean(self):
        """
        This will clean the information out that is
        considered private information
        """
        
    @classmethod    
    @abc.abstractmethod    
    def translate(self):
        """
        This prepares the data for a singular 
        cleaned format
        """
        
    @classmethod    
    @abc.abstractmethod    
    def osdify(self):
        """
        Translate the data to OSDI format
        """
