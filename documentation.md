---
layout: page
title: Documentation
permalink: /docs/
---

All the [data packages](/datasets/) are served through a JSON API server which is publicly available.
The same API server is used to populate our [interactive map](/map/). The API server provides an easy interface you can use to fetch all the available data, search, and filter the results in a machine-readable format.

**Note**: if you're interested in contributing additional data, please refer to the [contribute](/contribute/) page. If you want to learn the details about the structure of our data, go [here](/datasets/).

## Fetch all the data

By default, making an HTTPS request to a given data package, will return all the records. The basic data structure is common for all data packages, while the entries in the ```result``` key will variate according to the columns defined in the data package.

For example:

    $ curl https://digitalfreedom.io/api/targetedthreats | python -m json.tool
    {
        "description": "Targeted attacks related to civil society",
        "homepage": "",
        "license": "PDDL-1.0",
        "name": "data-targetedthreats",
        "repository": "https://github.com/digitalfreedom/data-targetedthreats.git",
        "result": [
            {
                "c2": "213.55.99.74",
                "country": "ET",
                "date": "2012-01-01",
                "family": "FinSpy",
                "md5": "8ae2febe04102450fdbc26a38037c82b",
                "reference": "https://citizenlab.org/2013/03/you-only-click-twice-finfishers-global-proliferation-2/",
                "target": "opposition"
            },
            {
                "c2": "46.4.69.25",
                "country": "ET",
                "date": "2013-12-01",
                "family": "RCS",
                "md5": "53a9e1b59ff37cc2aeff0391cc546201",
                "reference": "https://citizenlab.org/2014/02/hacking-team-targeting-ethiopian-journalists/",
                "target": "journalist"
            },
            ...
        ],
        "status": "success",
        "title": "Targeted Threats",
        "version": "0.1.0"
    }

## Query specific columns

The JSON API server allows you to filter the records by providing specific values to the column names.

**Example**: retrieve all surveillance vendors based in Germany:  
```curl "https://digitalfreedom.io/api/vendors?country=DE" | python -m json.tool```

**Example**: retrieve all targeted attacks related to Syria that have employed the DarkComet RAT:  
```curl "https://digitalfreedom.io/api/targetedthreats?country=SY&family=DarkComet" | python -m json.tool```

### Wildcard filters

You can additionally filter the results through wildcard searches.

**Example**: retrieve all surveillance vendors based in Germany and that contain the string *Trojan* in any of its fields:  
```curl "https://digitalfreedom.io/api/vendors?country=DE&search=Trojan" | python -m json.tool```

Which produces the following output:

    {
        "description": "A data package of suppliers of surveillance tech",
        "homepage": "",
        "license": "PDDL-1.0",
        "name": "data-vendors",
        "repository": "git://github.com/digitalfreedom/data-vendors.git",
        "result": [
            {
                "company": "DigiTask",
                "country": "DE",
                "solution": "Trojans, WiFi Interception",
                "website": ""
            },
            {
                "company": "Elaman",
                "country": "DE",
                "solution": "Trojans, Strategic & Tactical Communication Monitoring, Intelligence Gathering ",
                "website": ""
            }
        ],
        "status": "success",
        "title": "Surveillance Vendors",
        "version": "0.1.0"
    }


**Example**: retrieve all targeted attacks related to Syria and that contain the string *no-ip* in any of its fields (in this case, we're considering the Command & Control field):  
```curl "https://digitalfreedom.io/api/targetedthreats?country=SY&search=no-ip" | python -m json.tool```