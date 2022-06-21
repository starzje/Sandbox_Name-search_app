const prethodnePretrageText = document.getElementById("prethodnePretrage");
const rezultatiPretrageText = document.getElementById("div1");

document
  .getElementById("botunZaSlanje")
  .addEventListener("click", dohvatiPodatke);

function dohvatiPodatke(event) {
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
  //prebacuje oznake regija u puni naziv na hrvatskom HR -> Hrvatska
  const regionNamesInCroatian = new Intl.DisplayNames(["hr"], {
    type: "region",
  });

  // ako ime ne postoji ulazi se u prvi IF
  if (data.country[0] === undefined) {
    rezultatiPretrageText.innerHTML = `${data.name} nije ime koje postoji. Pokušaj ponovno.`;
    prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light">${data.name}</button> `;
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

    // ispisuje prethodno pretrazivano ime
    prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light">${data.name}</button> `;
  }
}
