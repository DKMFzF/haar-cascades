import uvicorn

from src.config.settings import Settings
from src.container import build_native_app


def run_native(settings: Settings) -> None:
    app = build_native_app(settings)
    app.run()


def run_api(settings: Settings) -> None:
    uvicorn.run(
        "src.api.app:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload,
    )


def main() -> None:
    settings = Settings()

    if settings.mod == "native":
        run_native(settings)
    elif settings.mod == "api":
        run_api(settings)
    else:
        raise ValueError(f"Unknown MOD value: {settings.mod!r}. Use 'native' or 'api'.")


if __name__ == "__main__":
    main()
