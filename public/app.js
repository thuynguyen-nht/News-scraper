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

$(document).on("click", "#access-notes", function () {

    $("#notes-display").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data_id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $(".modal-title").append("Notes for article ID: " + data._id);
            $("#notes-display").append("<p id='bodyinput'></p>");
            $("#form-notes").append("<button type='submit' class='btn btn-primary' id='submit' data_id='" + data._id + "'>Add notes</button>")


            // If there's a note in the article
            if (data.note) {

                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
                $("#bodyinput").append("<span><button type='button' class='btn btn-danger'>X</button></span>")
            }
        });
});

$(document).on("click", "#submit", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {

            // Value taken from note textarea
            body: $("#note-entry").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes-display").empty();
        });

    // Also, remove the values entered in the input for note entry

    $("#note-entry").val("");
});