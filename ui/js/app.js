$(document).on("nethserver-loaded", function () {
    // define app routing
    var app = $.sammy('#app-views', function () {
        this.use('Template');

        this.get('#/', function (context) {
            context.app.swap('');
            context.render('views/dashboard.html', {})
                .appendTo(context.$element());
        });

        this.get('#/item1', function (context) {
            context.app.swap('');
            context.render('views/item1.html', {})
                .appendTo(context.$element());
        });

        this.get('#/logs', function (context) {
            context.app.swap('');
            context.render('views/logs.html', {})
                .appendTo(context.$element());
        });

        this.get('#/about', function (context) {
            context.app.swap('');
            context.render('views/about.html', {})
                .appendTo(context.$element());
        });

        this.before('.*', function () {

            var hash = document.location.hash.replace("/", "");
            hash = hash == '#' ? '#dashboard' : hash
            $("nav>ul>li").removeClass("active");
            $("nav>ul>li" + hash + "-item").addClass("active");
        });

    });

    app.run('#/');

    /* call nethserver notifications */
    // success - hide notifications after 3 seconds
    parent.ns.$children[0].notifications.success.show = true
    parent.ns.$children[0].notifications.success.message = "Your success message"
    setTimeout(function () {
        parent.ns.$children[0].notifications.success.show = false;
    }, 3000)

    // error
    parent.ns.$children[0].notifications.error.show = true
    parent.ns.$children[0].notifications.error.message = "Your error message"

    // event
    parent.ns.$children[0].notifications.event.show = true
    parent.ns.$children[0].notifications.event.name = "Your event name"
    parent.ns.$children[0].notifications.event.message = "Your action-name"
    parent.ns.$children[0].notifications.event.progress = 50
    /* */

    /* call nethserver api */
    // read
    function read(callback) {
        parent.ns.exec(
            ["nethserver-cockpit-empty/read"],
            null,
            null,
            function (success) {
                success = JSON.parse(success);
                callback(success)
            },
            function (error) {
                callback(error)
            }
        );
    }


    // validate
    function validate(obj, callback) {
        parent.ns.exec(
            ["nethserver-cockpit-empty/validate"],
            obj,
            null,
            function (success) {
                var success = JSON.parse(success);
                callback(success)
            },
            function (error, data) {
                var errorData = JSON.parse(data);
                callback(errorData)
            }
        );
    }

    // update
    function update(obj, callback) {
        parent.ns.exec(
            ["nethserver-cockpit-empty/update"],
            obj,
            function (stream) {
                console.info("nethserver-cockpit-empty", stream);
            },
            function (success) {
                callback(success);
            },
            function (error) {
                callback(error);
            }
        );
    }

    // exec command and get raw output
    function execCmd(obj, stream, callback) {
        parent.ns.execRaw(
            ["nethserver-cockpit-empty/execute"],
            obj,
            function (output) {
                // this is the raw output from command
                stream(output);
            },
            function (success) {
                callback(success);
            },
            function (error) {
                callback(error);
            }
        );
    }

    read(function (response) {
        console.log(response);
    });

    var validateObj = {}
    validate(validateObj, function (result) {
        // check errors
        // if(result) { ... }

        // if no errors
        // update value
        update(validateObj, function (result) {
            // if errors
            parent.ns.$children[0].notifications.error.message = _("edit_error");

            // if no errors
            parent.ns.$children[0].notifications.success.message = _("edit_ok");
            setTimeout(function () {
                parent.ns.$children[0].notifications.success.show = false;
            }, 3000)
        })
    });

    var command = execCmd({
        action: 'my-action',
        function (output) {
            $('#my-textarea').append(output);
        },
        function (result) {
            console.info(result);
        }
    })
    /* */
})