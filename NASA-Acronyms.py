#!/usr/bin/env python3

"""
A Python3 tool that uses the NASA-Acronym data. Type in acronyms to resolve.

Usage: python3 NASA-Acronyms.py ABC

"""

import argparse
import json
import string
import sys
import traceback


ACRONYMS = 'acronyms to resolve'
INPUT = 'Enter an acronym to resolve, use <Ctrl+C> or empty string to exit.\n'
SUMMARY = 'Expand NASA acronyms to their long values'
VERBOSITY_LEVEL = 'the level of verbosity of output'

acronym_path = 'lists/acronyms.json'
verbosity_level = 0

# Read from the acronym data file.
with open(acronym_path) as reader:
    json_data = reader.read()
# Load the JSON data into python object.
data = json.loads(json_data)


def command_line():
    """Parse the arguments from the command line."""
    global verbosity_level
    parser = argparse.ArgumentParser(description=SUMMARY)
    parser.add_argument('-v', '--verbose', action='count',
                        default=verbosity_level, help=VERBOSITY_LEVEL)
    parser.add_argument('acronyms', help=ACRONYMS, nargs='+')
    arguments = parser.parse_args()
    verbosity_level = arguments.verbose
    print_results(process(arguments.acronyms))


def deacronym(acronym):
    """Find all the values for this acronym token."""
    results = []
    for item in data:
        # Casefolded strings can be used for caseless matching.
        if acronym == item['abbreviation'].casefold():
            result = "{:<60}".format(item['expansion'])
            if verbosity_level > 0:
                result += ' {:<9}'.format(item['source'])
            if verbosity_level > 1:
                result += ' {:<5}'.format(item['acronym_id'])
            if verbosity_level > 2:
                result += ' {:<3}'.format(item['source_id'])
            results.append(result)
    return results


def interactive():
    """Interactively prompt the user for acronyms."""
    try:
        value = None
        while value != '':
            value = input(INPUT)
            print_results(process([value]))
    except (KeyboardInterrupt, SystemExit):
        print('\nUser has quit, exiting program.')
        exit(2)
    except Exception:
        traceback.format_exc()
        exit(1)


def process(words):
    """Convert the words to normalized tokens to search for acronyms."""
    results = []
    for word in words:
        # Remove punctuation before and after each word
        token = word.strip(string.punctuation)
        # Casefolded strings may be used for caseless matching.
        results += deacronym(token.casefold())
    return results


def print_results(results):
    """ Print the results in a standard format."""
    for result in results:
        print(result)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        # Process the command line arguments.
        command_line()
    else:
        # There are no arguments run interactive mode.
        interactive()
