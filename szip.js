const AdmZip = require("adm-zip");
const path = require("path");

// ============================================================================
// Danh sách file/thư mục loại bỏ khi đóng gói plugin
// Chỉnh sửa các Set bên dưới để thêm/bớt pattern.
// ============================================================================

// Loại bỏ theo TÊN FILE (exact match, so sánh basename, KHÔNG phân biệt path)
const EXCLUDED_FILENAMES = new Set([
    // Composer / package metadata (không cần ở runtime)
    "composer.json",
    "composer.lock",
    "installed.json",
    "package.json",
    "package-lock.json",
    "yarn.lock",
    // Test / static analysis / build config
    "phpunit.xml",
    "phpunit.xml.dist",
    "phpstan.neon",
    "phpstan.neon.dist",
    "phpstan-baseline.neon",
    ".php-cs-fixer.php",
    ".php-cs-fixer.dist.php",
    ".gitignore",
    ".gitattributes",
    ".editorconfig",
    ".npmignore",
    "Makefile",
    "Dockerfile",
    // Documentation
    "CHANGELOG",
    "CHANGELOG.md",
    "CHANGELOG.txt",
    "CHANGES",
    "CHANGES.md",
    "README",
    "README.md",
    "README.rst",
    "README.txt",
    "UPGRADE.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "AUTHORS",
    "AUTHORS.md",
    // OS metadata
    ".DS_Store",
    "Thumbs.db",
]);

// Loại bỏ theo PHẦN MỞ RỘNG (so sánh không phân biệt hoa-thường)
const EXCLUDED_EXTENSIONS = new Set([
    ".md",
    ".rst",
    ".markdown",
    ".log",
    ".bak",
    ".tmp",
    ".map", // sourcemap
]);

// Loại bỏ nếu path có chứa segment trùng tên thư mục bên dưới
const EXCLUDED_DIRECTORIES = new Set([
    "tests",
    "Tests",
    "test",
    "doc",
    "docs",
    "examples",
    ".github",
    ".git",
    ".vscode",
    ".idea",
    "node_modules",
]);

/**
 * Hàm filter cho `adm-zip` addLocalFolder.
 * Trả về `true` để include, `false` để bỏ qua.
 *
 * `filename` mà adm-zip truyền vào là path tương đối kèm zipPath prefix,
 * ví dụ: `inc/lib/twig/vendor/twig/twig/CHANGELOG`.
 */
function shouldInclude(filename) {
    const normalized = filename.replace(/\\/g, "/");
    const segments = normalized.split("/");
    const basename = segments[segments.length - 1];
    const ext = path.extname(basename).toLowerCase();

    if (EXCLUDED_FILENAMES.has(basename)) return false;
    if (EXCLUDED_EXTENSIONS.has(ext)) return false;
    if (segments.some((seg) => EXCLUDED_DIRECTORIES.has(seg))) return false;

    return true;
}

async function createZipArchive() {
    const zip = new AdmZip();

    zip.addLocalFolder("./inc", "inc", shouldInclude);
    // assets/css
    zip.addLocalFolder("./assets/images", "assets/images", shouldInclude);
    //zip.addLocalFolder("./assets/languages", "assets/languages", shouldInclude);
    //zip.addLocalFolder("./assets/css/fonts", "assets/css/fonts", shouldInclude);
    //zip.addLocalFolder("./assets/css/lib", "assets/css/lib", shouldInclude);
    zip.addLocalFolder("./assets/css/minify", "assets/css/minify", shouldInclude);
    // assets/js
    // zip.addLocalFolder("./assets/js/lib", "assets/js/lib", shouldInclude);
    zip.addLocalFolder("./assets/js/minify", "assets/js/minify", shouldInclude);
    //zip.addLocalFolder("./assets/js/tel", "assets/js/tel", shouldInclude);
    zip.addLocalFile("sun-form-builder.php");
    zip.addLocalFile("readme.txt");

    const outputFile = "sun-form-builder.zip";
    zip.writeZip(outputFile);

    // Hậu xử lý: loại bỏ file .js bị lọt vào assets/css/minify (nếu có)
    const AddonsZip = new AdmZip(outputFile);
    let removed = 0;
    AddonsZip.getEntries().forEach(function (entry) {
        const entryName = entry.entryName;
        if (entryName.startsWith("assets/css/minify") && entryName.endsWith(".js")) {
            console.log("Removed:", entryName);
            AddonsZip.deleteFile(entryName);
            removed++;
        }
    });
    if (removed > 0) {
        AddonsZip.writeZip(outputFile);
    }

    console.log(`Created ${outputFile} successfully`);
}

createZipArchive();
