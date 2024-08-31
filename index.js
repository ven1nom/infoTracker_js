let myLeads = {
    linkedin: [],
    dev: []
}

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn")
const sectionSelect = document.getElementById("section-select")
const linkedinUl = document.getElementById("linkedin-ul")
const devUl = document.getElementById("dev-ul")
const exportLinkedInBtn = document.getElementById("export-linkedin-btn")
const exportDevBtn = document.getElementById("export-dev-btn")

// Load data from localStorage
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render()
}

tabBtn.addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const section = sectionSelect.value
        if (myLeads[section]) {
            myLeads[section].push(tabs[0].url)
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render()
        }
    })
})

inputBtn.addEventListener("click", function() {
    const section = sectionSelect.value
    if (myLeads[section] && inputEl.value) {
        myLeads[section].push(inputEl.value)
        inputEl.value = ""
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render()
    }
})

deleteBtn.addEventListener("click", function() {
    localStorage.clear()
    myLeads = {
        linkedin: [],
        dev: []
    }
    render()
})

exportLinkedInBtn.addEventListener("click", function() {
    exportToExcel(myLeads.linkedin, 'LinkedIn Blog')
})

exportDevBtn.addEventListener("click", function() {
    exportToExcel(myLeads.dev, 'Dev Blog')
})

function render() {
    renderSection(myLeads.linkedin, linkedinUl)
    renderSection(myLeads.dev, devUl)
}
function renderSection(leads, ulElement) {
    if (!Array.isArray(leads) || !ulElement) {
        console.error("Invalid input to renderSection")
        return
    }
    
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        // Check if the lead is a valid URL
        try {
            new URL(leads[i])
            listItems += `
                <li>
                    <a target='_blank' href='${leads[i]}'>
                        ${leads[i]}
                    </a>
                </li>
            `
        } catch (error) {
            console.warn(`Invalid URL: ${leads[i]}`)
            listItems += `
                <li>
                    ${leads[i]}
                </li>
            `
        }
    }
    ulElement.innerHTML = listItems
}

function exportToExcel(leads, sheetName) {
    if (!Array.isArray(leads)) {
        console.error("Invalid input to exportToExcel")
        return
    }
    
    const data = leads.map(link => [link])
    
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    
    XLSX.writeFile(wb, `${sheetName}.xlsx`)
}
