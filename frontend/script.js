
let data = []; // Declare data globally so it's accessible in handleSearch()

// Async function to fetch data
async function fetchData() {
  const url = "https://badr-project-8gul-bmhdis-projects.vercel.app/items";

  try {
    const response = await fetch(url);
    data = await response.json(); // Store fetched data in the global variable
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call fetchData immediately when the script loads
fetchData();

// Function to handle search
function handleSearch() {
  const query = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const resultDiv = document.getElementById("result");

  const match = data.find((entry) => entry.id?.toLowerCase() === query);

  if (match) {
    resultDiv.className = "result success";
    resultDiv.innerHTML = `
      <p><strong>تم العثور على النتيجة ✅</strong></p>
      <p>رقم مسار التلميذ: ${match.id}</p>
      <p>عدد ساعات الغياب الغير المبررة: ${match.value}</p>
    `;
  } else if (query) {
    resultDiv.className = "result error";
    resultDiv.innerHTML = `<p><strong>لم يتم العثور على أي نتيجة ❌</strong></p>`;
  } else {
    resultDiv.innerHTML = "";
    resultDiv.style.display = "none";
    return;
  }

  resultDiv.style.display = "block";
}
