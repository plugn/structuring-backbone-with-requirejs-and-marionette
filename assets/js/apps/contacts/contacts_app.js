define(["apps/../app",
        "apps/contacts/list/list_controller",
        "apps/contacts/show/show_controller",
        "apps/contacts/edit/edit_controller", // TODO refactor into apps/contacts/all.js
        "apps/header/list/list_controller"],
       function(ContactManager){
  ContactManager.module('ContactsApp', function(ContactsApp, ContactManager, Backbone, Marionette, $, _){
    ContactsApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "contacts": "listContacts",
        "contacts(?filter=:criterion)": "listContacts",
        "contacts/:id": "showContact",
        "contacts/:id/edit": "editContact"
      }
    });

    var API = {
      listContacts: function(criterion){
        ContactsApp.List.Controller.listContacts(criterion);
        ContactManager.HeaderApp.List.Controller.setActiveHeader("contacts");
      },

      showContact: function(id){
        ContactsApp.Show.Controller.showContact(id);
        ContactManager.HeaderApp.List.Controller.setActiveHeader("contacts");
      },

      editContact: function(id){
        ContactsApp.Edit.Controller.editContact(id);
        ContactManager.HeaderApp.List.Controller.setActiveHeader("contacts");
      }
    };

    ContactManager.on("contacts:list", function(){
      ContactManager.navigate("contacts");
      API.listContacts();
    });

    ContactManager.on("contacts:filter", function(criterion){
      if(criterion){
        ContactManager.navigate("contacts?filter=" + criterion);
      }
      else{
        ContactManager.navigate("contacts");
      }
    });

    ContactManager.on("contact:show", function(id){
      ContactManager.navigate("contacts/" + id);
      API.showContact(id);
    });

    ContactManager.on("contact:edit", function(id){
      ContactManager.navigate("contacts/" + id + "/edit");
      API.editContact(id);
    });

    ContactManager.addInitializer(function(){
      new ContactsApp.Router({
        controller: API
      });
    });
  });

  return ContactManager.ContactsApp;
});