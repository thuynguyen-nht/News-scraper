$("#scraper").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    window.location.replace("/scrape");
});


$(document).on("click", ".save-article", function () {

    var thisId = $(this).attr("data-id");
    $(this).hide();
    alert("Article saved. Article ID: " + thisId)

    var articleInfo = {}
    articleInfo.title = $("#title-" + thisId).text();
    articleInfo.link = $("#link-" + thisId).attr('href');
    articleInfo.summary = $("#summary-" + thisId).text();
    articleInfo.image = $("#image-" + thisId).attr('src').split(" ")[0];
    console.log(articleInfo);

    $.ajax({
        method: "POST",
        dataType: "json",
        url: "/api/saved",
        data: articleInfo
    })

});


//Delete an article
$(document).on("click", ".delete-article", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/saved/" + thisId
    })
        .then(function (data) {
            // Log the response
            console.log(data);
            location.reload();
        });
});


//Go to the notes page for a particular article
$(document).on("click", ".note-comment", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            window.location.replace("/articles/" + thisId);
        })

});

// Submit a note
$(document).on("click", "#submit-note", function (e) {

    e.preventDefault();
    // debugger
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a POST request to save the note
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#title-note").val(),
            // Value taken from note textarea
            body: $("#note-description").val()
        }
    })
        .then(function (data) {
            // Log the response
            // debugger
            console.log(data);
            // window.location.replace("/articles/" + data._id);
        }).catch(function (err) {
            // debugger
        });
    // Also, remove the values entered in the input and textarea for note entry
    $("#title-note").val("");
    $("#note-description").val("");
});

//delete a note
$(".delete-note").on("click", function () {
    var thisId = $(this).attr("data-id");
    console.log("This is line 142: " + thisId);
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            // Log the response
            console.log(data);
            location.reload();
        });
});