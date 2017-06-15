# sepa-dashboard
The dashbord is a Javascript in-browser application aimed at interacting with the Semantic Event Processing Architecutre to perform updates, queries and subscriptions.

## Loading JSAP files
A JSAP file is a JSON file containing the profile of a semantic SPARQL application. The JSAP file contains the parameters for 
the connection to an instance of SEPA and all the possible SPARLQ updates, queries and subscriptions (or their templates) 
defined for an application. The JSAP file contains also the namespaces defined for every query/update/subscription.
Loading a JSAP file is not mandatory. The dashboard can still be used by manually filling all the fields.

## Updates
To perform a SPARQL Update the user may select the update from the proper list 
(if a JSAP file containing updates has been loaded) and, if needed, modify the eventual forced bindings. 
Alternatively, the user may type the desired SPARQL update.

## Queries
Again, if a JSAP file has been loaded, then the user may select a query from the list and, if nedeed, modify the eventual forced bindings. 
A textbox allows to type a custom SPARQL query.

## Subscriptions
The same listboxes and fields used to issue a query can be used to perform a subscription (a persistent query). The only difference
consists in the destination address used to issue the subscription. Once a subscription is confirmed, its SPUID will be put in the dropdown list.
To close a subscription the user must select the related SPUID and click on Unsubscribe.

## License
The dashboard is released under GNU GPL V3.
