(function(){
    $(document).ready(init);
    var config = {
        apiKey: "AIzaSyAtPkdNr05YrBl-blfPt4KsQcuc-SGY-qI",
        authDomain: "computer-science-9d594.firebaseapp.com",
        databaseURL: "https://computer-science-9d594.firebaseio.com",
        projectId: "computer-science-9d594",
        storageBucket: "computer-science-9d594.appspot.com",
        messagingSenderId: "889886925352"
    };
     
    creators = 0;
    scratch = false;

    function init(){
        firebase.initializeApp(config);
        // Pull data for CS1 from Firebase
        let ref = firebase.database().ref("Projects");
        ref.on("child_added", snapshot => {
            // Convert Data
            let data = snapshot.val();
            
            // Create html element
            let div = document.createElement("div");
            div.classList.add("row")
            div.classList.add("project");

            // Create div for screenshots
            let photoDiv = document.createElement("div");
            photoDiv.classList.add("col");
            photoDiv.classList.add("s12");
            photoDiv.classList.add("m4");
            photoDiv.classList.add("offset-m1");
            photoDiv.classList.add("photoDiv");
            div.appendChild(photoDiv);

            if(data.FilePaths != undefined){
                // Get Screenshots
                for(var i = 0; i < data.FilePaths.length; i++){
                    firebase.storage().ref(data.FilePaths[i]).getDownloadURL().then(url => {
                        let img = document.createElement("img");
                        img.src = url;
                        photoDiv.appendChild(img);
                    });
                }
            }else if(data.ProjectType === "Scratch"){
                $(photoDiv).html(data.ScratchEmbed);
            }else{

            }

            // Make div for info
            let infoDiv = document.createElement("div");
            infoDiv.classList.add("col");
            infoDiv.classList.add("s12");
            infoDiv.classList.add("m6");
            div.appendChild(infoDiv);

            // Title
            let title = document.createElement("h4");
            title.textContent = data.Title;
            title.classList.add("col");
            title.classList.add("s12")
            title.classList.add("m12");
            title.classList.add("title");
            infoDiv.appendChild(title);

            // Creators
            let tempText = "Creators: ";
            let creators = document.createElement("h5");

            for(var i in data.Creators){
                tempText += data.Creators[i] + ", ";
            }

            creators.textContent = tempText
            creators.classList.add("col");
            creators.classList.add("s12");
            creators.classList.add("m12");
            creators.classList.add("creators");
            infoDiv.appendChild(creators);

            // Class
            let classTxt = document.createElement("h5");
            classTxt.textContent = "Class: " + data.Class;
            classTxt.classList.add("col");
            classTxt.classList.add("s12");
            classTxt.classList.add("m12");
            classTxt.classList.add("class");
            infoDiv.appendChild(classTxt);

            // Description
            let description = document.createElement("p");
            description.textContent = data.Description;
            description.classList.add("col");
            description.classList.add("s12");
            description.classList.add("m12");
            description.classList.add("description");
            infoDiv.appendChild(description);

            if(data.Class === "CS1"){
                $(".cs1Div").append(div);
            }else if(data.Class === "CS2"){
                $(".cs2Div").append(div);
            }else if(data.Class === "CS3"){
                $(".cs3Div").append(div);
            }else if(data.Featured === true){
                $(".homeDiv").append(div);
            }else{

            }
        });

        // Arrow button event listener
        $(".scroll").on("click", scroll);

        // Show div button event listeners
        $(".admin").on("click", showAdmin);
        $(".home").on("click", showHome);
        $(".cs1").on("click", showCS1);
        $(".cs2").on("click", showCS2);
        $(".cs3").on("click", showCS3);
        $(".addProject").on("click", showAddProject);

        // Authentication button event listeners
        $("#login").on("click", login);
        $(".logout").on("click", logout);

        // Add a New Project button event listeners
        $("#project").on("click", addProject);

        // Radio button event listener
        $("input[name=projectType]").on('click', radio);

        // Add a creator input button event listener
        $("#addCreator").on("click", addCreator);

        // Slidenav trigger
        $(".sidenav").sidenav();
    }

    function radio(){
        let clicked = $(this).val();
        
        if(clicked === "Scratch"){
            $('.scratch').fadeIn(200);
            scratch = true;
        }
    }

    function addCreator(){
        creators++;
        // console.log(creators);

        let input = document.createElement("input");
        input.classList.add("col");
        input.classList.add("m12");
        input.id = "creator" + String(creators);
        input.type = "text";
        $(input).attr("placeholder", "Student Name and Grade:");
        
        $(".creators").append(input);
    }

    // Add project function
    function addProject(){
        // Get Values
        let title = $("#title").val();
        let description = $("#description").val();
        let creatorArray = [];
        let embed = $("#url").val();

        // For loop to add all creators to creatorArray
        for(var i = 0; i < creators + 1; i++){
            creatorArray.push($("#creator" + i).val());
        }

        console.log(creatorArray);

        let classType = $("input[name=class]:checked").val();
        let projectType = $("input[name=projectType]:checked").val();

        // Generate a random key to use as a uid
        let key = firebase.database().ref("Project").push().key;

        // Get Files
        let files = $("#files")[0].files;
        let filePaths = [];

        if(files){
            // Loop through files
            for(var i = 0; i < files.length; i++){
                firebase.storage().ref("Projects/" + key + "/Screenshots/" + files[i].name).put(files[i], {contentType:files[i].type})   ;
                filePaths.push("Projects/" + key + "/Screenshots/" + files[i].name);
            }
        }

        // Send other data
        // if(scratch === true){
        //     firebase.database().ref("Projects/" + key).set({
        //         Title:title,
        //         Featured:false,
        //         Description:description,
        //         Creators:creatorArray,
        //         Class:classType,
        //         ProjectType:projectType,
        //         FilePaths:filePaths,
        //         ScratchEmbed:embed,
        //     });
        // }else{
        //     firebase.database().ref("Projects/" + key).set({
        //         Title:title,
        //         Featured:false,
        //         Description:description,
        //         Creators:creatorArray,
        //         Class:classType,
        //         ProjectType:projectType,
        //         FilePaths:filePaths,
        //     });
        // }

        setTimeout(() => {
            $(".homeDiv").css("display", "block");
            $("#loader").css("display", "none");
        }, 2000);

        $(".addProjectDiv").fadeOut(200);
        $("#loader").css("display", "block");

        // Empty inputs
        $("#title").val("");
        $("#description").val("");
    }

    // Logout function
    function logout(){
        firebase.auth().signOut().then(() => {
            location.replace("../html/home.html");
        });
    }

    // Login function
    function login(){
        let email = $("#email").val();
        let pass = $("#pass").val();

        // Authenticate User
        firebase.auth().signInWithEmailAndPassword(email, pass).catch(err => {
            let errCode = err.code;
            // console.log(errCode);
            if(errCode === "auth/wrong-password"){
                $("#pass").css("border-bottom-color", "red");
                $("email").css("border-bottom-color", "#003399");
                return;
            }

            if(errCode === "auth/invalid-email"){
                $("#email").css("border-bottom-color", "red");
                $("#pass").css("border-bottom-color", "#003399");
                return;
            }
        });

        // Change location and show loader when user auth state changes
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                setTimeout(() => {
                    location.replace("../html/adminHome.html");
                }, 2000);

                $(".adminDiv").fadeOut(200);
                $("#loader").css("display", "block");
            }
        });
    }

    // Function to scroll down to next div when the down arrow is pressed
    function scroll(){
        $("html, body").animate({
            scrollTop: $(".scroll").offset().top
        }, "slow");
    }

    // Function to show and scroll to the admin div
    function showAdmin(){
        $(".adminDiv").css("display", "block");
        $(".homeDiv").css("display", "none");
        $(".cs1Div").css("display", "none");
        $(".cs2Div").css("display", "none");
        $(".cs3Div").css("display", "none");
        $(".addProjectDiv").css("display", "none")

        $(".sidenav").sidenav("close");

        $("html, body").animate({
            scrollTop: $(".adminDiv").offset().top
        }, "slow")
    }

    // Function to show and scroll to the home div
    function showHome(){
        $(".adminDiv").css("display", "none");
        $(".homeDiv").css("display", "block");
        $(".cs1Div").css("display", "none");
        $(".cs2Div").css("display", "none");
        $(".cs3Div").css("display", "none");
        $(".addProjectDiv").css("display", "none")

        $(".sidenav").sidenav("close");

        $("html, body").animate({
            scrollTop: $(".homeDiv").offset().top
        }, "slow")
    }

    // Function to show and scroll to the cs1 div
    function showCS1(){
        console.log("working");
        $(".adminDiv").css("display", "none");
        $(".homeDiv").css("display", "none");
        $(".cs1Div").css("display", "block");
        $(".cs2Div").css("display", "none");
        $(".cs3Div").css("display", "none");
        $(".addProjectDiv").css("display", "none")

        $(".sidenav").sidenav("close");

        $("html, body").animate({
            scrollTop: $(".cs1Div").offset().top
        }, "slow")
    }

    // Function to show and scroll to the cs2 div
    function showCS2(){
        $(".adminDiv").css("display", "none");
        $(".homeDiv").css("display", "none");
        $(".cs1Div").css("display", "none");
        $(".cs2Div").css("display", "block");
        $(".cs3Div").css("display", "none");
        $(".addProjectDiv").css("display", "none");

        $(".sidenav").sidenav("close");

        $("html, body").animate({
            scrollTop: $(".cs2Div").offset().top
        }, "slow")
    }

    // Function to show and scroll to the cs3 div
    function showCS3(){
        $(".adminDiv").css("display", "none");
        $(".homeDiv").css("display", "none");
        $(".cs1Div").css("display", "none");
        $(".cs2Div").css("display", "none");
        $(".cs3Div").css("display", "block");
        $(".addProjectDiv").css("display", "none")

        $(".sidenav").sidenav("close");

        $("html, body").animate({
            scrollTop: $(".cs3Div").offset().top
        }, "slow")
    }

    // Function to show and scroll to the add a project div
    function showAddProject(){
        $(".adminDiv").css("display", "none");
        $(".homeDiv").css("display", "none");
        $(".cs1Div").css("display", "none");
        $(".cs2Div").css("display", "none");
        $(".cs3Div").css("display", "none");
        $(".addProjectDiv").css("display", "block")

        $(".sidenav").sidenav("close");

        $("html, body").animate({
            scrollTop: $(".addProjectDiv").offset().top
        }, "slow")
    }
})();