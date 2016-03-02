jquery-chainem
--------------
--------------

Chain Em is a jQuery Plugin that implements dependent HTML select (combo)
selections.

The basic idea is that some HTML select tags represent links of a chain. Once a 
value of the chain is selected (has changed), subsecuent links will be 
updated with vaild values derived from the previous links. That can happen in 
two ways, depending on which mode the plugin is configured with.

Modes of Operation
------------------

1. Filtering: In this mode, all combos must have at least one option appended. This means 
that when a link is changed subsecuent links will have their options restricted 
according to functions (remote or local) provided by the user. 

2. Chaining: In this mode, only the first link has values. Once a value from a link is 
selected, a parameter "oneStep" that determines how the following links 
are updated.
If "oneStep" is true, then the user will have to walk the chain link for link, 
  meaning that he/she must pick a value from each link individually. Otherwise 
  the following links will be automatically updated.

Definining Functions for Modes of Operation (DOING)
-------------------------------------------

- For Filtering 
    - Have a key in the "methods" configuration array named after the link id 
    (the link id matches the one defined in the select HTML).

    - Have a parameter which contains an asociative array containing the chain 
    values at the moment of updating. Sometimes this parameter is refered as to 
    "previousValues" or "pv".

    - Return a numeric array containing the values that should be available given
    the "previousValues" selected.   


- For Chaining

Local/Remote methods
--------------------


Regardless of the mode of operation selected, new values of links can be fetched
from either a remote source or a local one.

If you do wish to retrieve your values from local defined function, then you must
define a function in the "methods" configuration array.

Otherwise, the method will be considered as being "remote", which means the 
values will be obtained from a remote source.

Configuring the Remote source
-----------------------------

This source can be configured via the remote-methods configuration array. It has
three options available:

- url: The URL where to obtain the values from
- patternize (default: true): 
- pattern (default: 'get')

The patternize option allows to append to the URL which method (on an MVC 
controller)should be called to obtain a certain link value based on its ID.
For default values, this pattern will be URL + '/get' + ID


