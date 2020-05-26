// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {

        let bigDiv = $("<div class='media my-3'>");

        bigDiv.attr("data_id", data[i]._id);

        let smallDiv = $("<div class='media-body ml-3'>");
        let clickImage = $("<a>").attr("href", data[i].link);
        let image = $("<img alt='news'>").attr("src", data[i].image.split(" ")[0]);
        let title = $("<h5 class='mt-0'>").text(data[i].title.replace(/\t/g, ''));

        let p = $("<p>").text(data[i].summary)

        clickImage.append(image);
        smallDiv.append(title, p)

        bigDiv.append(clickImage, smallDiv);
        $("#articles-section").append(bigDiv);





    };
});