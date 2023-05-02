using Microsoft.AspNetCore.Mvc;

namespace WebApplication2.Controllers
{
    public class LoginRegister : Controller
    {
        public IActionResult LoginRegisterPage()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login()
        {
            return RedirectToAction("Index", "Home");
        }
    }
}
