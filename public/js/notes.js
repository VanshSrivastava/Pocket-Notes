const inputElm = document.getElementById("notes");
window.addEventListener("load", (e) => {
  getNotes();
});
function toggleThis() {
  var element = document.getElementById("navbarSupportedContent");
  element.classList.toggle("show");
} 
async function getNotes() {
  try {
    const res = await fetch("/getallnotes", {
      method: "GET",
    });
    const data = await res.json();
    if (data.notes.length != 0) {
      displayNotes(data.email, data.notes);
    } //ADDING NOTE

    //DISPLAYING A info of no notes
    else {
      inputElm.innerHTML = `<div class="alert alert-info" role="alert"">
    There are no Notes yet "Add a Note and Create" to display Your Notes
  </div>`;
    }
  } catch (e) {
    console.log(e);
  }
}

let add = document.getElementById("addBtn");
add.addEventListener("click", (e) => {
  let title = document.getElementById("addTtl");
  let text = document.getElementById("addTxt");
  const ttl = title.value;
  const txt = text.value;
  if (ttl !== "" && txt !== "") {
    addNote(ttl, txt);
    title.value = "";
    text.value = "";
  } else {
    mbox();
  }
});
let desc=document.getElementById("description");
async function addNote(ttl, txt) {
  try {
    const details = { ttl, txt };
    const res = await fetch("/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });
    const data = await res.json();
    if(data.success == 'false'){
      desc.innerHTML=`<p class="text-danger">Title limit is 10 characters</p>`
      setTimeout(() => {
      
        desc.style.display = 'none';
      }, 5000);
    }  
    else if (data.success== 'true') {
       displayNotes(data.userDetail.email, data.userDetail.notes);
     } 
     //DISPLAYING A info of no notes
  } catch (e) {
    console.log(e);
  }
}

const del = document.getElementById("del");
let yes = document.getElementById("modal-btn-yes");
let no = document.getElementById("modal-btn-no");
let modalBox2 = document.getElementById("delModal");
let shut = document.getElementsByClassName("shut")[0];
del.addEventListener("click", function (e) {
  modalBox2.style.display = "block";

  shut.onclick = function () {
    modalBox2.style.display = "none";
  };
  yes.onclick = function () {
    delAll();
    modalBox2.style.display = "none";
  };
  no.onclick = function () {
    modalBox2.style.display = "none";
  };
});

function displayNotes(email, data) {
  const inputElm = document.getElementById("notes");
  let html = "";

  data.forEach(function (value, index, array) {
    value.heading = value.heading.toUpperCase();
    html += `
  <div class="ncard mx-3 mb-5 card bg-transparent text-white" id = "crd" style="width: 19rem;"> 
  <img src="images/post-it.png" class="card-img" >
  <div class="card-img-overlay">
  <button id= "bmark"><svg xmlns="./bookmark(1).svg" width="16" height="16" fill="#2e8b86" class="bi bi-bookmarks" viewBox="0 0 16 16">
  <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1H4z"/>
  <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1z"/></svg></button>
  <span class= "card-title">${value.heading}</span>
 
    <p class= "card-text">${value.content}</p>
    <button type="button" name="${email}"  id="${value._id}" onclick= "deleteNotes(this.name,this.id)" class="btn btn-outline-danger">Delete</button>
  </div>
</div>`;
  });
  inputElm.innerHTML = html; //ADDING NOTE
}
//TODO create a function for deleting notes and modal box
//delete using delete request route crud
async function deleteNotes(email, id) {
  const detail = { email, id };
  try {
    const res = await fetch("/delnote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(detail),
    });
    const data = await res.json();
    if (data.status === "ok") {
      getNotes();
    } else {
      console.log(data);
    }
  } catch (e) {
    console.log("haan" + e);
  }
}

async function delAll() {
  try {
    const res = await fetch("/delAll", {
      method: "POST",
    });
    const data = await res.json();
    if (data.status === "ok") {
      getNotes();
    } else {
      console.log(data);
    }
  } catch (e) {
    console.log("e");
  }
}

//to display a modalbox
let modalbox = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
function mbox() {
  modalbox.style.display = "block";

  span.onclick = function () {
    modalbox.style.display = "none";
  };
  window.onclick = function (e) {
    if (e.target == modalbox) {
      modalbox.style.display = "none";
    }
  };
}
//create search function and find a way to handle heading format

const stxt = document.getElementById("searchTxt");
const sbtn = document.getElementById("searchBtn");
stxt.addEventListener("input", function () {
  search(stxt.value);
});
sbtn.addEventListener("click", function () {
  if (stxt.value !== "") {
    search(stxt.value);
  } else {
    inputElm.innerHTML = `
    <div class="alert alert-warning" role="alert">
            There are no matching Notes!         
  </div>`;

    setTimeout(function () {
      getNotes();
    }, 3000);
  }
});
function search(value) {
  let sval = value.toLowerCase();

  let card = document.getElementsByClassName("ncard");
  Array.from(card).forEach(function (element) {
    let cardTxt = element.getElementsByTagName("p")[0].innerText;
    let ttx = element.getElementsByTagName("span")[0].innerText;
    if (cardTxt.includes(sval) || ttx.includes(sval.toUpperCase())) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}
