<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>Cursos - AmphIQ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="../css/styles.css" rel="stylesheet" />
    <link href="Cursos.css" rel="stylesheet" />
</head>
<body class="d-flex flex-column h-100 bg-cream">
    
    <div id="particles" style="position: fixed; width: 100%; height: 100%; z-index: -1; overflow: hidden; top:0;"></div>

    <main class="flex-shrink-0">
        <nav class="navbar navbar-expand-lg navbar-light py-3 sticky-top" id="mainNav" style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px);">
            <div class="container px-5">
                <a class="navbar-brand" href="index.html">
                    <span class="fw-bolder text-forest" style="font-family: 'DM Serif Display';">AmphIQ</span>
                </a>
                <div class="ms-auto">
                    <a href="index.html" class="btn btn-outline-forest rounded-pill px-4">
                        <i class="bi bi-arrow-left me-2"></i>Volver al Inicio
                    </a>
                </div>
            </div>
        </nav>

        <header class="py-5">
            <div class="container px-5">
                <div class="text-center my-5 reveal">
                    <h1 class="display-3 fw-bolder mb-3" style="font-family: 'DM Serif Display'; color: var(--forest);">Mis Cursos</h1>
                    <p class="lead fw-normal text-muted mb-4">Selecciona un área para continuar tu aprendizaje.</p>
                </div>
            </div>
        </header>

        <section class="pb-5">
            <div class="container px-5">
                <div class="row gx-5 justify-content-center">
                    <div class="col-lg-5 mb-5">
                        <div class="card h-100 shadow-sm border-0 card-course reveal">
                            <div class="card-img-top-container bg-sage-light d-flex align-items-center justify-content-center">
                                <i class="bi bi-translate text-white display-1"></i>
                                <div class="course-badge">Nivel A1</div>
                            </div>
                            <div class="card-body p-4">
                                <div class="badge bg-sage-light text-forest mb-2">Idiomas</div>
                                <h4 class="card-title mb-3" style="font-family: 'Outfit'; color: var(--forest);">English Technical</h4>
                                <p class="card-text text-muted">Aprende vocabulario técnico mediante retos interactivos.</p>
                            </div>
                            <div class="card-footer p-4 pt-0 bg-transparent border-top-0">
                                <a href="../Sopa de Letras/Sopa.html" class="btn btn-main w-100 py-3">
                                    <span class="btn-text">Empezar Minijuego</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-5 mb-5 opacity-75">
                        <div class="card h-100 shadow-sm border-0 card-course border-dashed">
                            <div class="card-body p-5 d-flex flex-column align-items-center justify-content-center text-center">
                                <i class="bi bi-code-slash display-4 text-sage mb-3"></i>
                                <h4 class="card-title mb-2" style="font-family: 'Outfit';">Lógica</h4>
                                <p class="card-text text-muted">Disponible muy pronto.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script>
        const container = document.getElementById('particles');
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 8 + 3;
            // Usamos tus colores verde sage
            p.style.cssText = `
                width:${size}px; height:${size}px;
                background: #8aab8e;
                left:${Math.random()*100}%;
                top:${Math.random()*100}%;
                position: absolute;
                border-radius: 50%;
                opacity: 0.4;
                animation: float ${Math.random()*14+8}s infinite linear;
            `;
            container.appendChild(p);
        }

        // Animación Reveal
        const revealEls = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                }
            });
        }, { threshold: .15 });
        revealEls.forEach(el => observer.observe(el));
    </script>
</body>
</html>