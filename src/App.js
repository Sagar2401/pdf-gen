import "./App.css";
import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Data, Dropdown } from "./Data/data";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState(Dropdown[0].key);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  console.log("course", course);
  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const courseName = Dropdown.filter((item) => item.key === course);
    const { height } = page.getSize();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText(`Ref- B101`, {
      x: 50,
      y: height - 50,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Name: ${name}`, {
      x: 50,
      y: height - 80,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Course: ${courseName[0].title}`, {
      x: 50,
      y: height - 110,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    const currentDate = new Date().toLocaleDateString();
    page.drawText(`Date of Offer (current date): ${currentDate}`, {
      x: 50,
      y: height - 140,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Fee structure: `, {
      x: 50,
      y: height - 170,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    const table = Data[course];

    const tableTopY = height - 190;
    const rowHeight = 20;
    const colWidth = 120;
    const colPaddingX = 10;
    const colPaddingY = 15;

    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[i].length; j++) {
        const cellText = table[i][j];
        const x = 50 + j * colWidth + colPaddingX;
        const y = tableTopY - i * rowHeight - colPaddingY;

        page.drawText(cellText, {
          x,
          y,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
    }

    // Draw horizontal lines
    for (let i = 0; i <= table.length; i++) {
      const y = tableTopY - i * rowHeight;
      page.drawLine({
        start: { x: 50, y },
        end: { x: 50 + table[0].length * colWidth, y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }

    // Draw vertical lines
    for (let i = 0; i <= table[0].length; i++) {
      const x = 50 + i * colWidth;
      page.drawLine({
        start: { x, y: tableTopY },
        end: { x, y: tableTopY - table.length * rowHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "offer_letter.pdf";
    link.click();
  };

  return (
    <div className="w-[600px] mt-4 mx-7">
      <h2 className="text-lg mb-5">Generate Offer Letter</h2>
      <form>
        <div>
          <div class="mb-4 flex gap-2 items-center">
            <label
              class="block text-gray-700 text-lg font-bold mb-2"
              for="username"
            >
              Name
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={name}
              onChange={handleNameChange}
            />
          </div>
        </div>
        <div class="w-full flex items-center gap-5">
          <label
            class="block text-gray-700 text-lg font-bold mb-2"
            for="username"
          >
            State
          </label>
          <select
            class="block appearance-none cursor-pointer bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={course}
            onChange={handleCourseChange}
          >
            {Dropdown.map((item) => (
              <option value={item.key}>{item.title}</option>
            ))}
          </select>
        </div>
      </form>
      <div className="flex gap-3 mt-3">
        <button
          onClick={generatePDF}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          class="bg-green-500 text-white font-bold py-2 px-4 rounded"
          onClick={generatePDF}
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
}

export default App;
