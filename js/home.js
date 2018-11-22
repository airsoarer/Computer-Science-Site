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

    function init(){
        firebase.initializeApp(config);
        // Arrow button event listener
        $(".scroll").on("click", scroll);

        // Show div button event listeners
        $(".admin").on("click", showAdmin);
        $("#home").on("click", showHome);
        $("#cs1").on("click", showCS1);
        $("#cs2").on("click", showCS2);
        $("#cs3").on("click", showCS3);
        $("#addProject").on("click", showAddProject);

        // Authentication button event listeners
        $("#login").on("click", login);
        $(".logout").on("click", logout);

        // Add a New Project button event listeners
        $("#project").on("click", addProject);

        // Add a creator input button event listener
        $("#addCreator").on("click", addCreator);
    }

    function addCreator(){
        creators++;

        let input = document.createElement("input");
        input.classList.add("col");
        input.classList.add("m12");
        input.classList.add("creator" + creators);
        $(input).attr("placeholder", "Student Name and Grade:");
        
        $(".creators").append(input);
    }

    // Add project function
    function addProject(){
        // Get Values
        let title = $("#title").val();
        let description = $("#description").val();
        let creatorArray = [];

        for(var i = 0; i < creators + 1; i++){
            creatorArray.push($(".creator" + i).val());
        }

        let classType = $("input[name=class]:checked").val();
        let projectType = $("input[name=projectType]:checked").val();

        console.log(title, description, creatorArray, classType, projectType);
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

        $("html, body").animate({
            scrollTop: $(".homeDiv").offset().top
        }, "slow")
    }

    // Function to show and scroll to the cs1 div
    function showCS1(){
        $(".adminDiv").css("display", "none");
        $(".homeDiv").css("display", "none");
        $(".cs1Div").css("display", "block");
        $(".cs2Div").css("display", "none");
        $(".cs3Div").css("display", "none");
        $(".addProjectDiv").css("display", "none")

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

        $("html, body").animate({
            scrollTop: $(".addProjectDiv").offset().top
        }, "slow")
    }
})();