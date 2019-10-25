"""
Python implementation of NASA-Acronyms for usage
in Natural Language Processing.

@author Syed Haseeb Shah

python/black: passed
mypy : passed

"""

import urllib.request
import json
import os
from typing import List, IO

# If the  .JSON doesn't exist download it from repository
os.chdir('..')
prevDir = os.getcwd()
srcDir = prevDir + "/src"

if "acronyms.json" not in os.listdir(srcDir):
    print("[!] Downloading Acronym.json database.")
    req = urllib.request.urlopen(
        "https://raw.githubusercontent.com/nasa/NASA-Acronyms/master/acronyms.json"
    )
    json_data = req.read()
    with open("acronyms.json", "wb") as fd: #type: IO
        fd.write(json_data)


with open("acronyms.json") as fd:
    json_data = fd.read()


data = json.loads(json_data)
keys = [entry["abbreviation"] for entry in data]
values = [entry["expansion"] for entry in data]


def deAcronym(string:str) -> str:
    '''
    >>> deAcronym('NASA')
    'National Aeronautics and Space Administration'
    >>> deAcronym('NAPA')
    'National Academy of Public Administration'
    >>> deAcronym(35)
    Traceback (most recent call last):
      ...
    AttributeError: 'int' object has no attribute 'split'
    >>> deAcronym([1,32,'NASA'])
    Traceback (most recent call last):
      ...
    AttributeError: 'list' object has no attribute 'split'
    >>> deAcronym(['NASA', 'NAPA'])
    Traceback (most recent call last):
      ...
    AttributeError: 'list' object has no attribute 'split'
    >>> deAcronym('ASF')
    'Alaska SAR Facility'
    >>> deAcronym('DSFW$')
    'DSFW$'
    '''
    lines = string.split("\n")
    words :List[str]= []
    for line in lines:
        words += line.split(" ")

    for word in words:
        if word in keys:
            string = string.replace(word, values[keys.index(word)])

    return string


if __name__ == "__main__":
    # Let's run some tests
    import doctest
    doctest.testmod()

    text ="""
    NASA was established in 1958, succeeding the National Advisory
    Committee for Aeronautics (NACA). The new agency was to have a distinctly
    civilian orientation, encouraging peaceful applications in space science.[7][8][9]
    Since its establishment, most US space exploration efforts have been led by NASA,
    including the Apollo Moon landing missions, the Skylab space station, and later the
    Space Shuttle. NASA is supporting the International Space Station and is overseeing
    the development of the Orion Multi-Purpose Crew Vehicle, the Space Launch System
    and Commercial Crew vehicles. The agency is also responsible for the Launch Services
    Program which provides oversight of launch operations and countdown management for
    unmanned NASA launches.
    """
    print(deAcronym(text))

