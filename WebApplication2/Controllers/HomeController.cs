using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;


namespace WebApplication2.Controllers
{
    public class HomeController : Controller
    {
        // Dependency injection of IWebHostEnvironment
        private readonly IWebHostEnvironment _hostingEnvironment;

        public HomeController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: /Home/Index
        // Displays the file input form
        public IActionResult Index()
        {
            return View();
        }


        // POST: /Home/Index
        // Handles the file upload and modification

        [HttpPost]
        public IActionResult Index(IFormFile fileInput)
        {

            // Checks if a file was uploaded
            if (fileInput == null || fileInput.Length == 0)
            {
                ModelState.AddModelError("fileInput", "Please select a file.");
                return View();
            }


            // Check if file is a CSV file
            if (Path.GetExtension(fileInput.FileName) != ".csv")
            {
            
                ModelState.AddModelError("fileInput", "Only CSV files are allowed.");
                
                return View();
            
            }

            // Gets the file name and path for saving
            string fileName = Path.GetFileName(fileInput.FileName);
            string filePath = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", fileName);


            // Saves the uploaded file to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                fileInput.CopyTo(stream);
            }
            // Reads all lines of the uploaded file
            string[] lines = System.IO.File.ReadAllLines(filePath);


            //this loop looks through every element of the CSV file, and looks for EITHER: '0' or integers 1-100, and modifies the file 
            //to reflect the rules we have established (0 == A, 1-120 = P)

            for (int i = 0; i < lines.Length; i++)
            {
                lines[i] = Regex.Replace(lines[i], @"\b([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|120)\b", "P");
                lines[i] = lines[i].Replace("0", "A");
            }

            string outputFileName = "MODIFIED_" + Path.GetFileNameWithoutExtension(fileName) + Path.GetExtension(fileName);
            string outputFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "downloads", outputFileName);

            System.IO.File.WriteAllLines(outputFilePath, lines);
            return RedirectToAction("Download", new { fileName = outputFileName });
        }


        // GET: /Home/Download?fileName={fileName}
        // Downloads the modified file with the specified file name
        public IActionResult Download(string fileName)
    {
            //checks if file name is empty 
       if (string.IsNullOrEmpty(fileName))
       {
            
          return Content("filename not present");
       }

      string filePath = Path.Combine(_hostingEnvironment.WebRootPath, "downloads", fileName);

      string[] lines = System.IO.File.ReadAllLines(filePath);

        //Redundant, but for some reason, if this is not present, the new file will not be modified, and will just download a copy of the same file. Not sure whats going on here, ChatGPT doesnt know either. 
        // loops through file looking for either 0 or numbers 1-120, and replaces them with 'A' or 'P' respectively. 
     for (int i = 0; i < lines.Length; i++)
     {
                lines[i] = Regex.Replace(lines[i], @"\b([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|120)\b", "P");

                lines[i] = lines[i].Replace("0", "A");
     }

     //this creates the new file name, essentially just puts "MODIFIED" in front of the file name to make sure it is easy to find unmodified file. 
     string outputFileName = Path.GetFileNameWithoutExtension(fileName) + "_modified" + Path.GetExtension(fileName);

     // Combine the web root path and the new output file name to get the output file path
      string outputFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "downloads", outputFileName);


            // Write all the modified lines to the output file
            System.IO.File.WriteAllLines(outputFilePath, lines);

            // Read all the bytes from the output file into an array of bytes
            byte[] fileBytes = System.IO.File.ReadAllBytes(outputFilePath);

            // Return the file as a downloadable file with the new output file name
            return File(fileBytes, "application/octet-stream", outputFileName);
    }
        }
}
