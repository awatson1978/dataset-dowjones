**dataset-dowjones** is a Meteorite package that provides 20 years worth of Dow Jones Index summaries.


------------------------
### Installation

First, install the dataset-dictionary package from the command line, like so:

````
mrt add dataset-dowjones
````

Alternatively, if you'd like to bypass Atmosphere, and install directly from GitHub, you could update your application's smart.json file, like so:

````
{
  "meteor": {
    "branch": "master"
  },
  "packages": {
    "dataset-dowjones": {
      "git": "https://github.com/awatson1978/dataset-dowjones.git"
    }
  }
}

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

//-------------------------------------------------------------
// A.  Generate Index

Template.dowjonesIndexTemplate.daySummaryList = function(){
    try{
        return DowJones.find({
                'Date': { $regex: Session.get('day_summary_search'), $options: 'i' }
        },{limit: 20});
    }catch(error){
        console.log(error);
    }
};


//-------------------------------------------------------------
// B.  Display Record in Edit Pannel When Clicked

Template.dowjonesIndexTemplate.events({
    'click .list-group-item':function(event, template){
        try{
            //alert('selected_record! ' + this._id);
            Session.set('selected_record', this._id);
            Session.set('selected_date', this._id);
            Session.set('current_action','view');
        }catch(error){
            console.log(error);
        }
    }
});


//-------------------------------------------------------------
// C.  Filter Results When User Enters Search Term

Template.dowjonesIndexTemplate.events({
    'keyup #daySummarySearchInput': function(evt,tmpl){
        try{
            Session.set('day_summary_search', $('#daySummarySearchInput').val());
            Meteor.flush();
        }catch(err){
            console.log(err);
        }
    }
});


````


------------------------
### CRUD Forms Data/Document Model

Once those peices are in place, you're ready to implement the rest of the CRUD pattern, by adding a form and buttons for Create, Update, and Delete functions.

````html
<template name="dowjonesFormTemplate">
    {{#if record}}
        {{#with record}}
        <div class="padded">
            <div class="panel panel-info">
                <div class="panel-heading padded">
                    <bold>Customer ID:</bold> {{_id}}
                </div>
                <div class="dowjones-form">
                    <!-- don't add with-bottom-padding to the first column, so it displays on mobile correctly -->
                    <div class="col col-lg-6">
                        <input id="dateInput" type="text" placeholder="Date" value="{{Date}}" {{date_enabled}}></input>
                        <label class="smallgray" for="dateInput">Date</label>

                        <input id="openInput" type="text" placeholder="Open" value="{{Open}}"  {{open_enabled}}></input>
                        <label class="smallgray" for="openInput">Open</label>

                        <input id="highInput" type="text" placeholder="High" value="{{High}}"  {{high_enabled}}></input>
                        <label class="smallgray" for="highInput">High</label>
                    </div>
                    <div class="col col-lg-6">
                        <input id="volumeInput" type="text" placeholder="Volume" value="{{Volume}}"  {{volume_enabled}}></input>
                        <label class="smallgray" for="volumeInput">Volume</label>

                        <input id="lowInput" type="text" placeholder="Low" value="{{Low}}"  {{low_enabled}}></input>
                        <label class="smallgray" for="lowInput">Low</label>

                        <input id="closeInput" type="text" placeholder="Close" value="{{Close}}"  {{close_enabled}}></input>
                        <label class="smallgray" for="closeInput">Close</label>

                    </div>
                </div>

                {{#if isNewMarketSummary}}
                <div class="spacer row"></div>
                <div class="container">
                    <div class="col col-lg-12">
                        <button id="newMarketSummaryButton" type="button" class="fullwidth btn btn-info" width="100%">Create New Record!</button>
                    </div>
                </div>
                {{/if}}

                {{#if isDeletingMarketSummary}}
                <div class="padded container">
                    <div class="alert alert-danger">
                        <h4 class="centered">Are you sure you want to delete this record?</h4>
                        <div class="container">
                            <div class="col col-lg-6">
                                <button id="deleteSummaryButton" type="button" class="fullwidth btn btn-danger">Delete</button>
                            </div>
                            <div class="col col-lg-6">
                                <button id="cancelDeleteSummaryButton" type="button" class="fullwidth btn btn-danger">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
                {{/if}}
            </div>
        </div>
        {{/with}}
    {{else}}
    <div class="padded">
        <div class="panel panel-info">
            <div class="panel-heading padded">
                <bold>Customer ID:</bold> ...
            </div>
            <div class="centered padded dowjones-form">
                <h2>Select a record.</h2>
            </div>
        </div>
    </div>
    {{/if}}
</template>
````

------------------------
### CRUD Forms Controller

And when that's in place, you're ready for the final step in implementing the pattern, with the following.

````js


//-------------------------------------------------------------
// D.  Edit Form Helper 

Template.dowjonesFormTemplate.helpers({
    record: function(){
        try{
            if(Session.get('current_action') == 'new'){
                return {"Date":"","Open":"","High":"","Low":"","Close":"","Volume":""};
            }else{
                return DowJones.findOne(Session.get('selected_date'));
            }
        }catch(error){
            console.log(error);
        }
    }
});


//-------------------------------------------------------------
// E. Active Input When Clicked ot Tapped

Template.dowjonesFormTemplate.events({
    'click #dateInput':function(){
        Session.set('editing_date', true);
        Meteor.flush();
    },
    'click #openInput':function(){
        Session.set('editing_open', true);
        Meteor.flush();
    },
    'click #highInput':function(){
        Session.set('editing_high', true);
        Meteor.flush();
    },
    'click #lowInput':function(){
        Session.set('editing_low', true);
        Meteor.flush();
    },
    'click #closeInput':function(){
        Session.set('editing_close', true);
        Meteor.flush();
    },
    'click #volumeInput':function(){
        Session.set('editing_volume', true);
        Meteor.flush();
    }
})


//-------------------------------------------------------------
// F. Submit Input to Mongo (Update)

Template.dowjonesFormTemplate.events(
    okCancelEvents('#dateInput',
        {
            ok: function (value) {
                DowJones.update(Session.get('selected_date'), {$set: { 'Date': value }});
                Session.set('editing_date', false);
                Meteor.flush();
            },
            cancel: function () {
                Session.set('editing_date', false);
            }
        })
);
// etc, etc, et....

//-------------------------------------------------------------
// G. Determine if Input should be Readonly 

Template.dowjonesFormTemplate.date_enabled = function(){
    if(Session.get('global_edit')){
        return "enabled";
    }else if(Session.get('editing_date')){
        return "enabled";
    }else{
        return "readonly";
    }
};
// etc, etc, etc...



//-------------------------------------------------------------
// H. Determine if Buttons Should be Displayed

Template.dowjonesFormTemplate.isNewMarketSummary = function(){
    try{
        if(Session.get('current_action') == 'new'){
            return true;
        }else{
            return false;
        }
    }catch(error){
        console.log(error);
    }
};
Template.dowjonesFormTemplate.isDeletingMarketSummary = function(){
    try{
        if(Session.get('current_action') == 'delete'){
            return true;
        }else{
            return false;
        }
    }catch(error){
        console.log(error);
    }
};


//-------------------------------------------------------------
// I. Call Server Side New Word Method (New, Delete)


Template.dowjonesFormTemplate.events({
    'click #newMarketSummaryButton': function(){
        console.log('creating new user...');

        try{

            // TODO:  add validation functions
            if ($('#dateInput').val().length) {

                Meteor.call('createNewDaySummary', {
                    Date: $('#dateInput').val(),
                    Open: $('#openInput').val(),
                    High: $('#highInput').val(),
                    Low: $('#volumeInput').val(),
                    Close: $('#closeInput').val(),
                    Volume: $('#lowInput').val()
                }, function (error, customer) {
                    console.log('error: ' + error);
                    console.log('customer: ' + customer);
                });
            } else {
                Session.set("createError",
                    "Customer needs a name, or why bother?");
            }
            evt.target.value = '';
        }catch(err){
            console.log(err);
        }

        Session.set('current_action','view');
    },
    'click #deleteSummaryButton': function(){
        DowJones.remove(Session.get('selected_record'));
        Session.set('current_action','view');
    },
    'click #cancelDeleteSummaryButton': function(){
        Session.set('current_action','view');
    }
});

````

------------------------
### Licensing

Dow Jones historical data copyright Yahoo! Finance or independent data provider; fair use for educational purposes.
Everything else, MIT License. Use as you wish, including for commercial purposes.


------------------------
### Support
Found this package to be useful?  Consider tipping the package maintainer for their time!  

[![Support via Gittip](https://raw.github.com/gittip/www.gittip.com/master/www/assets/gittip.png)](https://www.gittip.com/awatson1978/)  
