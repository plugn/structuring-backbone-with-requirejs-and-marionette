define(["app"], function(ContactManager){
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
        require(["apps/contacts/list/list_controller"], function(ListController){
          ListController.listContacts(criterion);
          ContactManager.execute("set:active:header", "contacts");
        });
      },

      showContact: function(id){
        require(["apps/contacts/show/show_controller"], function(ShowController){
          ShowController.showContact(id);
          ContactManager.execute("set:active:header", "contacts");
        });
      },

      editContact: function(id){
        require(["apps/contacts/edit/edit_controller"], function(EditController){
          EditController.editContact(id);
          ContactManager.execute("set:active:header", "contacts");
        });
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
