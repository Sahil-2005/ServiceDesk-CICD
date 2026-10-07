const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Strip brutalist borders and shadows
  content = content.replace(/border-black/g, 'border-slate-700/50');
  content = content.replace(/border-\[3px\]/g, 'border');
  content = content.replace(/border-2/g, 'border');
  content = content.replace(/shadow-\[.*?\]/g, 'shadow-lg shadow-black/40');
  
  // Update backgrounds to dark theme
  content = content.replace(/bg-white/g, 'bg-slate-800/70 backdrop-blur-xl');
  content = content.replace(/bg-gray-100/g, 'bg-slate-800/90');
  content = content.replace(/hover:bg-gray-100/g, 'hover:bg-slate-700');
  content = content.replace(/hover:bg-gray-50/g, 'hover:bg-slate-700/50');
  content = content.replace(/bg-yellow-100/g, 'bg-slate-900/80');
  
  // Specific bg replacements for tickets
  content = content.replace(/bg-blue-100/g, 'bg-indigo-900/30 text-indigo-300 border-indigo-500/30');
  content = content.replace(/bg-amber-100/g, 'bg-amber-900/30 text-amber-300 border-amber-500/30');
  content = content.replace(/bg-purple-100/g, 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-500/30');
  content = content.replace(/bg-green-100/g, 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30');
  content = content.replace(/bg-gray-200/g, 'bg-slate-800 text-slate-300 border-slate-600');
  
  // Update text colors
  content = content.replace(/text-black/g, 'text-slate-100');
  content = content.replace(/text-gray-[0-9]+/g, 'text-slate-400');
  
  // Accent colors mapping
  content = content.replace(/bg-accent-500/g, 'bg-indigo-600 hover:bg-indigo-500 text-white');
  content = content.replace(/text-accent-500/g, 'text-indigo-400');
  content = content.replace(/hover:text-accent-500/g, 'hover:text-indigo-300');
  content = content.replace(/bg-indigo-600 hover:bg-indigo-500 text-white text-white/g, 'bg-indigo-600 hover:bg-indigo-500 text-white');

  // Simplify fonts
  content = content.replace(/font-extrabold/g, 'font-semibold');
  content = content.replace(/font-bold/g, 'font-medium');
  content = content.replace(/ uppercase /g, ' '); 

  fs.writeFileSync(file, content);
});
console.log("Theme updated across all JSX files!");
