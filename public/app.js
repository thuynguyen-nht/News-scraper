$("#scraper").on("click", function () {
    $.ajax({
            method: "GET",
            url: "/scrape",
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $.getJSON("/articles", function (data) {
                // For each one
                for (var i = 0; i < data.length; i++) {

                    let bigDiv = $("<div class='media my-3'>");

                    bigDiv.attr("data_id", data[i]._id);

                    let smallDiv = $("<div class='media-body ml-3'>");
                    let clickImage = $("<a target='_blank'>").attr("href", data[i].link);
                    let image = $("<img alt='news' id='news-image'>").attr("src", data[i].image.split(" ")[0]);
                    let title = $("<h5 class='mt-0'>").text(data[i].title.replace(/\t/g, ''));
                    let clickTitle = $("<a target='_blank'>").attr("href", data[i].link);
                    let p = $("<p>").text(data[i].summary);

                    let btnArea = $("<div>");
                    let saveBtnArea = $("<span>");
                    let saveBtn = $("<i class='fas fa-plus-circle' id='save-articles'>  Save Article</i>").attr("data_id", data[i]._id);
                    saveBtnArea.append(saveBtn)
                    btnArea.append(saveBtnArea);

                    clickImage.append(image);
                    clickTitle.append(title)
                    smallDiv.append(clickTitle, p, btnArea)

                    bigDiv.append(clickImage, smallDiv);
                    $("#articles-section").append(bigDiv);

                };
            });
        });
});

$(document).on("click", "#save-articles", function () {

    var thisId = $(this).attr("data_id");
    alert("Article saved. Article ID: " + thisId)
    $.ajax({
            method: "GET",
            url: "/articles/saved/" + thisId,
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section

            let bigDiv = $("<div class='media my-3'>");

            bigDiv.attr("data_id", data._id);

            let smallDiv = $("<div class='media-body ml-3'>");
            let clickImage = $("<a target='_blank'>").attr("href", data.link);
            let image = $("<img alt='news' id='news-image'>").attr("src", data.image.split(" ")[0]);
            let title = $("<h5 class='mt-0'>").text(data.title.replace(/\t/g, ''));
            let clickTitle = $("<a target='_blank'>").attr("href", data.link);
            let p = $("<p>").text(data.summary);

            let btnArea = $("<div>");
            let deleteBtnArea = $("<span>");
            let deleteBtn = $("<i class='fas fa-trash-alt' id='delete-article'>  DELETE ARTICLES</i>").attr("data_id", data._id)

            let addBtnArea = $("<span>")
            let addBtn = $("<i class='fas fa-sticky-note' id='access-notes' data-toggle='modal' data-target='#notes'>  NOTES</i>").attr("data_id", data._id)

            addBtnArea.append(addBtn);

            deleteBtnArea.append(deleteBtn);
            btnArea.append(addBtnArea, deleteBtnArea);

            clickImage.append(image);
            clickTitle.append(title)
            smallDiv.append(clickTitle, p, btnArea)

            bigDiv.append(clickImage, smallDiv);
            $("#saved-section").append(bigDiv);

        });
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