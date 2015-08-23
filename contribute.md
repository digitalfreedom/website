---
layout: page
title: Contribute
permalink: /contribute/
---

We warmly welcome help and contributions, we want the Digitial Freedom Alliance to be a collaboration and diverse community effort, not something created & controlled by a small group. Currently, we are unfunded and doing this as a labor of love. Our mission is to create resources and tools to help better understand digital threats against civil society and we are figuring out the shape of it as we go iteratively. There are a few ways you can help contribute. The primary contributors are most likely to be activists, journalists, NGOs, human rights workers, policy wonks, hackers, publishing organizations, academics, and security researchers.

## 1. Contribute Data

Contributing data is the easiest way to contribute. Please browse our [existing data packages](/datasets/) to see what we already have and figure out if you have something to offer. There is a range of contributions we will accept. The only thing we ask, is that your contributions be accurate and verifiable.

### Good: Fill Out Data In Existing Datasets

Add new entries or fill out missing data values in our existing data packages. If you know how to use Git / Github simply fork the repository, open the CSV in a spreadsheet app, fill in fields with your data, and then send a pull request on Github. You can also just downloaded a CSV and email it to us or upload it elsewhere. For example: in our [targetedthreats](/datasets/targetedthreats/) dataset, if there is a column called `country` and empty filed called `target` that is blank, you could fill that out with the value `activist`:

    target:
    country: CA

### Better: Expand Upon Existing Datasets

Taking it a step further, if you have (or see potential) for additional data fields that is missing from one of our datasets, that is great even better. For example, the following data values expand upon similar to the dataset that is above. Notice `country` being changed to `target_home_country` and the additional `target_current_country` field as well:

    target: activist
    target_home_country: IN
    target_current_country: CA

These more granular fields offer richer data to visualize and can express much more detail about a complex dynamic such as an activist who lives in one country (CA) being targeted for surveillance because of where they used to live (IN).

### Amazing: Contribute New Datasets / Indices

The most amazing type of contributions would be adding new datasets that we do not have yet. For example, if you are a researcher or journalist, and you have data about digital privacy, surveillance, data protection, or legal cases in your specific country or city that does not fit into any of the existing data packages. For example: you could create a datapackage called "Searches & Seizures" that documents cases of people having they digital devices or data seized by government:

    action: device seizure
    target: researcher
    target_home_country: US
    target_current_country: US
    details: a security researcher had their device seized by an airport staff after secondary screening
    date: 2012-04-05

The amount of data that is added should be considered. The goal is have as much detail as possible, while also operating within legal agreements and safety.

---

## 2. Contribute Visualizations & Ideas

Also awesome is contributing idea on how to connect existing datapackages as to a specific purpose or visualization. We are in very early stages of figuring out how to utilize these datapackages and display them. We avidly want feedback and use cases we haven't thought of, yet.
