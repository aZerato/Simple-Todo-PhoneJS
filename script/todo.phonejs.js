window.TodoApp = {};

/* Collection of Todos */
todosCollection = [
    { 
        content: "Nothing",
        state: false 
    }
];

/* Todo */
function Todo(id, content, state) {
        var self = this;
        self.id = id;
        self.content = content;
        self.state = state;
}

$(function () {
    TodoApp.app = new DevExpress.framework.html.HtmlApplication(
        { 
            namespace: TodoApp,
            defaultLayout: "default"
        }
    );
                    
    TodoApp.app.router.register(":view/:name", { view: "home", name: '' }); 
    
    TodoApp.app.navigate();
});

/*
 * ViewModels
 */

/* ViewModel Home */
TodoApp.home = function () {
    
    var viewModel = {};

    /* Data */
    viewModel.login = ko.observable('');
    viewModel.password = ko.observable('');

    /* Functions */
    viewModel.connection = function() {
        if(this.login() == 'aze' && this.password() == 'aze')
            TodoApp.app.navigate('connection/' + this.login() );
        else
           DevExpress.ui.dialog.alert('Have you entered the good password ?', 'Unable to connect'); 
    }

    viewModel.about = function() {
        TodoApp.app.navigate('about/');
    }

    return viewModel;
};

/* ViewModel Connection */
TodoApp.connection = function (params) {
    
    var viewModel = {};

    viewModel.message = ko.observable('Hello ' + params.name + ' !');

    viewModel.todos = function() {
        TodoApp.app.navigate('todos/' + params.name );
    }

    return viewModel;
};

/* ViewModel Todos */
TodoApp.todos = function (params) {
    
    var viewModel = {};

    viewModel.message = ko.observable('List of yours todos !');
    viewModel.todosList = ko.observableArray();

    viewModel.addTodo = function() {
        this.todosList.push(
            new Todo(
                this.todosList().length == 0 ? 1 : this.todosList()[this.todosList().length-1].id+1,
                ko.observable('content'),
                ko.observable(false)
            )
        );
    };

    viewModel.removeTodo = function(todo) {
        viewModel.todosList.remove(todo.model.__key__);
    };

    viewModel.loadTodos = function() {
         var ltodos = localStorage.getItem("todos");
        if(ltodos == null) {
                DevExpress.ui.dialog.alert('Error to load Todo', 'No Todo !');
                return;
        }
        viewModel.todosList(JSON.parse(ltodos));
    }

    viewModel.saveTodos = function() {
            localStorage.setItem("todos", ko.toJSON(viewModel.todosList()));
    };

    viewModel.clearTodos = function() {
            localStorage.clear();
    };

    return viewModel;
};

/* ViewModel About */
TodoApp.about = function (params) {
    var viewModel = {};

    viewModel.message = ko.observable('About the App !');

    return viewModel;
};