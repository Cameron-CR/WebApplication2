using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;

namespace WebApplication2.Controllers
{
    public class HomeController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public HomeController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(IFormFile fileInput)
        {
            if (fileInput == null || fileInput.Length == 0)
            {
                ModelState.AddModelError("fileInput", "Please select a file.");
                return View();
            }

            string fileName = Path.GetFileName(fileInput.FileName);
            string filePath = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                fileInput.CopyTo(stream);
            }

            string[] lines = System.IO.File.ReadAllLines(filePath);

            for (int i = 0; i < lines.Length; i++)
            {
                lines[i] = lines[i].Replace("0", "A");
            }

            string outputFileName = Path.GetFileNameWithoutExtension(fileName) + "_modified" + Path.GetExtension(fileName);
            string outputFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "downloads", outputFileName);

            System.IO.File.WriteAllLines(outputFilePath, lines);

            return View(new { DownloadedFile = new { FileName = outputFileName } });
        }

        public IActionResult Download()
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "downloads", Request.Query["fileName"]);

            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);

            return File(fileBytes, "application/octet-stream", Request.Query["fileName"]);
        }
    }
}
