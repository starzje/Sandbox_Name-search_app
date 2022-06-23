const prethodnePretrageText = document.getElementById("prethodnePretrage");
const rezultatiPretrageText = document.getElementById("div1");

//prebacuje oznake regija u puni naziv na hrvatskom HR -> Hrvatska
const regionNamesInCroatian = new Intl.DisplayNames(["hr"], { type: "region" });

document
  .getElementById("botunZaSlanje")
  .addEventListener("click", dohvatiPodatke);

function dohvatiPodatke(event) {
  event.preventDefault();
  let unos = event.target.previousElementSibling.value;
  fetch(`https://api.nationalize.io/?name=${unos}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      prikaziNoveRezultate(data);
    });
}

//funkcija koja ispisuje rezultate na stranicu
function prikaziNoveRezultate(data) {
  // ako ime ne postoji ulazi se u prvi IF
  if (data.country[0] === undefined) {
    rezultatiPretrageText.innerHTML = `${data.name} nije ime koje postoji. Pokušaj ponovno.`;
    prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light undefined_btn">${data.name}</button> `;
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

    let svePretrage = [data.name + " = "];
    for (let i = 0; i < data.country.length; i++) {
      svePretrage.push(
        regionNamesInCroatian.of(data.country[i].country_id) +
          " " +
          Math.ceil(data.country[i].probability * 100) +
          "%"
      );
    }

    prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light">${svePretrage.join(
      " "
    )}</button> `;

    //ispisuje sve pretrage u prethodnePretrageText

    prethodnePretrageText.addEventListener("click", function (event) {
      let unos = event.target.innerText;
      let niz = unos.split("=");
      let ime = niz[0];
      let zemlje = niz.slice(1);
      if (event.target.classList.contains("undefined_btn")) {
        rezultatiPretrageText.innerHTML = `Već si provjerio ove podatke, i znaš da ${ime} nije pravo ime`;
      } else {
        rezultatiPretrageText.innerHTML = `Već si provjerio ove podatke, ali vjerojatnost da je ${ime} iz zemlje ${zemlje}`;
      }
    });
  }
}
