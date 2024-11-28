Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/classify_image",  // URL for backend classification
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Drag an image or click to upload",
        autoProcessQueue: false,
    });

    // Ensure only one file is allowed
    dz.on("addedfile", function () {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);
        }
    });

    // On Classify button click
    $("#submitBtn").on("click", function (e) {
        // Check if any file exists in Dropzone
        if (dz.files.length === 0) {
            alert("Please upload an image before classifying!");
            return;
        }

        // Get the image data
        const file = dz.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result;

            // Debug: Check image data
            console.log("Sending image to backend...");

            // Post to Flask endpoint
            const url = "http://127.0.0.1:5000/classify_image";
            $.post(url, { image_data: imageData }, function (data, status) {
                console.log("Response:", data);
                handleResponse(data);
            }).fail(function (xhr) {
                console.error("Failed to classify:", xhr.status, xhr.statusText);
                alert("Error in processing the image. Check backend logs.");
            });
        };
        reader.readAsDataURL(file);
    });

    // Handle Backend Response
    function handleResponse(data) {
        if (!data || data.error) {
            $("#error").show();
            $("#resultHolder").hide();
            $("#divClassTable").hide();
            return;
        }

        let players = ["lionel_messi", "maria_sharapova", "roger_federer", "serena_williams", "virat_kohli"];
        let bestMatch = null;
        let bestScore = -1;

        for (let item of data) {
            const maxScore = Math.max(...item.class_probability);
            if (maxScore > bestScore) {
                bestMatch = item;
                bestScore = maxScore;
            }
        }

        if (bestMatch) {
            $("#error").hide();
            $("#resultHolder").html($(`[data-player="${bestMatch.class}"`).html()).show();
            $("#divClassTable").show();

            for (let person in bestMatch.class_dictionary) {
                const index = bestMatch.class_dictionary[person];
                const score = bestMatch.class_probability[index];
                $(`#score_${person}`).html(score.toFixed(2));
            }
        }
    }

    // Hide UI sections on page load
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();
}

$(document).ready(function () {
    init();
});
