const prethodnePretrageText = document.getElementById("prethodnePretrage");
const rezultatiPretrageText = document.getElementById("div1");
const button = document.getElementById("botunZaSlanje");
//prebacuje oznake regija u puni naziv na hrvatskom HR -> Hrvatska
const regionNamesInCroatian = new Intl.DisplayNames(["hr"], { type: "region" });

//event listener za dugme
button.addEventListener("click", dohvatiPodatke);

// dohvaca podatke kroz API
function dohvatiPodatke(event) {
  event.preventDefault();
  let unos = event.target.previousElementSibling.value;
  fetch(`https://api.nationalize.io/?name=${unos}`)
    .then((response) => response.json())
    .then((data) => {
      prikaziNoveRezultate(data);
    });
}

//funkcija koja ispisuje rezultate na stranicu
function prikaziNoveRezultate(data) {
  // ako ime ne postoji ulazi se u prvi IF
  if (data.country[0] === undefined) {
    rezultatiPretrageText.innerHTML = `${data.name} nije ime koje postoji. Pokušaj ponovno.`;
    prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light undefined_btn" id="main-btn">${data.name}</button> `;
  }
  //ako ime postoji tj. sadržava objekt country ulazi se u else
  else {
    // drugi IF -> Ako ne postoji druga ili treca zemlja za to ime, ispisuje se samo jedna zemlja
    if (
      typeof data.country[1] === "undefined" ||
      typeof data.country[2] === "undefined"
    ) {
      rezultatiPretrageText.innerHTML = `Vjerojatnost da je ${
        data.name
      } iz zemlje
<ul>
  <li>
    ${regionNamesInCroatian.of(data.country[0].country_id)} 
    =
    ${Math.ceil(data.country[0].probability * 100)}%
  </li>
</ul>`;
    }
    // ako postoje 3 zemlje, ispisuju se sve 3 zemlje
    else {
      rezultatiPretrageText.innerHTML = `Vjerojatnost da je ${
        data.name
      } iz zemlje
<ul>
  <li>
    ${regionNamesInCroatian.of(data.country[0].country_id)} 
    =
    ${Math.ceil(data.country[0].probability * 100)}%
  </li>
  <li>
    ${regionNamesInCroatian.of(data.country[1].country_id)}
    =
    ${Math.ceil(data.country[1].probability * 100)}%
  </li>
  <li>
    ${regionNamesInCroatian.of(data.country[2].country_id)}
    =
    ${Math.ceil(data.country[2].probability * 100)}%
  </li>
</ul>`;
    }

    // loopa kroz sve rezultate i ispisuje podatke zemlje u prethodne pretrage
    let svePretrage = [data.name + " = "];
    for (let i = 0; i < data.country.length; i++) {
      svePretrage.push(
        regionNamesInCroatian.of(data.country[i].country_id) +
          " " +
          Math.ceil(data.country[i].probability * 100) +
          "%"
      );
    }

    prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light" id="main-btn">${svePretrage.join(
      " "
    )}</button> `;

    //na klik u prethodnim pretragama, ispisuje se ponovno samo ono ime koje je kliknuto
    prethodnePretrageText.addEventListener("click", function (event) {
      let unos = event.target.innerText;
      let niz = unos.split("=");
      let ime = niz[0];
      let zemlje = niz.slice(1);
      //ako je na dugmetu undefined_btn klasa (ime koje ne postoji), ispisuje se prvi IF, u suprotnom se ispisuje else
      if (event.target.classList.contains("undefined_btn")) {
        rezultatiPretrageText.innerHTML = `Već si provjerio ove podatke, i znaš da ${ime} nije pravo ime`;
      } else {
        rezultatiPretrageText.innerHTML = `Već si provjerio ove podatke, ali vjerojatnost da je ${ime} iz zemlje ${zemlje}`;
      }
    });
  }
  // očisti inpit nakon entera
  document.getElementById("basic-url").value = "";
}
