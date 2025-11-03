export default function FooterSection() {
  return (
    <footer id="contact" className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About CIMAGE */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">CIMAGE Add-On Courses</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Bridging the gap between academic learning and industry requirements through comprehensive, hands-on training programs. Your complete roadmap from classroom to industry success.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <span className="text-sm font-semibold">f</span>
              </div>
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <span className="text-sm font-semibold">t</span>
              </div>
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                <span className="text-sm font-semibold">in</span>
              </div>
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                <span className="text-sm font-semibold">ig</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Why Choose Us</a></li>
              <li><a href="#courses" className="hover:text-white transition-colors">Courses</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                <div>
                  <div>info@cimage.edu</div>
                  <div className="text-sm">admissions@cimage.edu</div>
                </div>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <div>
                  <div>+91 XXX XXX XXXX</div>
                  <div className="text-sm">+91 YYY YYY YYYY</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">📍</span>
                <div>
                  CIMAGE Campus<br />
                  Technology Hub<br />
                  City, State - 123456
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">🕒</span>
                <div className="text-sm">
                  Mon-Fri: 9AM-6PM<br />
                  Sat: 10AM-4PM
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 md:mb-0">
              &copy; 2025 CIMAGE Add-On Courses. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
