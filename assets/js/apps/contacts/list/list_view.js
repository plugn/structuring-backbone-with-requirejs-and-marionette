define(["apps/../app",
        "tpl!apps/contacts/list/templates/list.tpl",
        "tpl!apps/contacts/list/templates/list_item.tpl"],
       function(ContactManager, listTpl, listItemTpl){
  ContactManager.module('ContactsApp.List', function(List, ContactManager, Backbone, Marionette, $, _){
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

    List.Contacts = Backbone.Marionette.CompositeView.extend({
      tagName: "table",
      className: "table table-hover",
      template: listTpl,
      itemView: List.Contact,
      itemViewContainer: "tbody"
    });
  });

  return;
});