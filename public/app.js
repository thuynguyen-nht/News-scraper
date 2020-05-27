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
            let deleteBtn = $("<i class='fas fa-trash-alt' id='delete-article'>  DELETE ARTICLES</i>")

            let addBtnArea = $("<span>")
            let addBtn = $("<i class='fas fa-sticky-note' id='access-notes' data-toggle='modal' data-target='#notes'>  NOTES</i>")

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