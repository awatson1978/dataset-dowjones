**dataset-dowjones** is a Meteorite package that provides 20 years worth of Dow Jones Index summaries.


------------------------
### Installation

First, install the dataset-dictionary package from the command line, like so:

````
meteor add awatson1978:dataset-dowjones
````


------------------------
### Data/Document Model for Reading Data from Collection

Once done, you'll want to display data from the collection by adding the following templates into your document model.  The class names come from Bootstrap v3.

````html
<template name="dowjonesIndexTemplate">
  <div class="padded">
    <div class="panel panel-info">
      <div class="panel-heading">
          <input id="daySummarySearchInput" type="text" placeholder="Filter..."></input>
      </div>
      <ul class="list-group">
        {{#each daySummaryList}}
          {{> daySummaryItemTemplate }}
        {{/each}}
      </ul>
    </div>
  </div>
</template>

<template name="daySummaryItemTemplate">
  <li class="list-group-item">{{Date}}</li>
</template>
````

------------------------
### Controller for Reading Data from Collection

To dislay data, you'll also need to add the controllers, like so:

````js

Template.dowjonesIndexTemplate.helpers({
  daySummaryList: function(){
    return DowJones.find({
            'Date': { $regex: Session.get('day_summary_search'), $options: 'i' }
    },{limit: 20});
  };
});

````

------------------------
### Licensing

Dow Jones historical data copyright Yahoo! Finance or independent data provider; fair use for educational purposes.
Everything else, MIT License. Use as you wish, including for commercial purposes.
