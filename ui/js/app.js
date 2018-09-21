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
    function read() {
        parent.ns.exec(
            ["nethserver-cockpit-empty/read"],
            null,
            null,
            function (success) {
                success = JSON.parse(success);
                return success
            },
            function (error) {
                return error
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

    var status = read();
    console.log(status);

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
    /* */
})