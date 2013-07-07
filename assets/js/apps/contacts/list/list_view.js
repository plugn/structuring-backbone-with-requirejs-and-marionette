define(["apps/../app",
        "tpl!apps/contacts/list/templates/layout.tpl",
        "tpl!apps/contacts/list/templates/panel.tpl",
        "tpl!apps/contacts/list/templates/none.tpl",
        "tpl!apps/contacts/list/templates/list.tpl",
        "tpl!apps/contacts/list/templates/list_item.tpl"],
       function(ContactManager, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  ContactManager.module('ContactsApp.List', function(List, ContactManager, Backbone, Marionette, $, _){
    List.Layout = Marionette.Layout.extend({
      template: layoutTpl,

      regions: {
        panelRegion: "#panel-region",
        contactsRegion: "#contacts-region"
      }
    });

    List.Panel = Marionette.ItemView.extend({
      template: panelTpl,

      triggers: {
        'click button.js-new': "contact:new"
      },

      events: {
        'click button.js-filter': 'filterClicked'
      },

      ui: {
        criterion: "input.js-filter-criterion"
      },

      filterClicked: function(){
        var criterion = this.$el.find(".js-filter-criterion").val();
        this.trigger("contacts:filter", criterion);
      },

      onSetFilterCriterion: function(criterion){
        $(this.ui.criterion).val(criterion);
      }
    });

    List.Contact = Backbone.Marionette.ItemView.extend({
      tagName: "tr",
      template: listItemTpl,

      events: {
        "click": "highlightName",
        "click td a.js-show": "showClicked",
        "click td a.js-edit": "editClicked",
        "click button.js-delete": "deleteClicked"
      },
 
      flash: function(cssClass){
        var $view = this.$el;
        $view.hide().toggleClass(cssClass).fadeIn(800, function(){
          setTimeout(function(){
            $view.toggleClass(cssClass)
          }, 500);
        });
      },

      highlightName: function(e){
        this.$el.toggleClass('warning');
      },

      showClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger("contact:show", this.model);
      },

      editClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger("contact:edit", this.model);
      },

      deleteClicked: function(e){
        e.stopPropagation();
        this.trigger("contact:delete", this.model);
      },

      remove: function(){
        this.$el.fadeOut(function(){
          $(this).remove();
        });
      }
    });

    var NoContactsView = Backbone.Marionette.ItemView.extend({
      template: noneTpl,
      tagName: "tr",
      className: "alert"
    });

    List.Contacts = Backbone.Marionette.CompositeView.extend({
      tagName: "table",
      className: "table table-hover",
      template: listTpl,
      emptyView: NoContactsView,
      itemView: List.Contact,
      itemViewContainer: "tbody",

      initialize: function(){
        this.listenTo(this.collection, "reset", function(){
          this.appendHtml = function(collectionView, itemView, index){
            collectionView.$el.append(itemView.el);
          }
        });
      },

      onCompositeCollectionRendered: function(){
        this.appendHtml = function(collectionView, itemView, index){
          collectionView.$el.prepend(itemView.el);
        }
      }
    });
  });

  return;
});