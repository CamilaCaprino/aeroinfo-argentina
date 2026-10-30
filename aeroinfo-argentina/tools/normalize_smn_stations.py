import json
import sys
from pathlib import Path


def coordinate_to_decimal(degrees: str, minutes: str) -> float:
    deg = float(degrees.replace(",", "."))
    mins = float(minutes.replace(",", "."))

    sign = -1 if deg < 0 else 1

    return sign * (abs(deg) + mins / 60)


def parse_station_line(line: str, line_number: int):
    # El TXT del SMN usa ancho fijo:
    # 0:31  -> nombre
    # 31:68 -> provincia
    # 68:   -> lat_gr lat_min lon_gr lon_min altura nro oaci

    nombre = line[0:31].strip()
    provincia = line[31:68].strip()

    tail = line[68:].strip()

    if not nombre or not tail:
        return None

    fields = tail.split()

    if len(fields) == 7:
        (
            lat_deg,
            lat_min,
            lon_deg,
            lon_min,
            altura,
            numero_estacion,
            codigo_oaci,
        ) = fields

    elif len(fields) == 6:
        (
            lat_deg,
            lat_min,
            lon_deg,
            lon_min,
            altura,
            numero_estacion,
        ) = fields

        codigo_oaci = None

    else:
        raise ValueError(
            f"Línea {line_number}: formato inesperado. "
            f"Campos: {fields}"
        )

    latitud = coordinate_to_decimal(lat_deg, lat_min)
    longitud = coordinate_to_decimal(lon_deg, lon_min)

    return {
        "nombre": nombre,
        "provincia": provincia or None,
        "codigo_oaci": (
            codigo_oaci.strip().upper()
            if codigo_oaci
            else None
        ),
        "numero_estacion": numero_estacion.strip() or None,
        "latitud": round(latitud, 7),
        "longitud": round(longitud, 7),
        "altura_m": float(altura.replace(",", ".")),
    }


def main():
    if len(sys.argv) != 3:
        print(
            "Uso: python tools/normalize_smn_stations.py "
            "<entrada.txt> <salida.json>"
        )
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not input_path.exists():
        print(f"No existe el archivo: {input_path}")
        sys.exit(1)

    # El archivo oficial viene en ISO-8859-1.
    lines = input_path.read_text(
        encoding="iso-8859-1"
    ).splitlines()

    stations = []
    errors = []

    # Las primeras dos filas son encabezados.
    for line_number, line in enumerate(lines[2:], start=3):
        if not line.strip():
            continue

        try:
            station = parse_station_line(
                line,
                line_number
            )

            if station:
                stations.append(station)

        except Exception as exc:
            errors.append(str(exc))

    oaci_codes = [
        station["codigo_oaci"]
        for station in stations
        if station["codigo_oaci"]
    ]

    station_numbers = [
        station["numero_estacion"]
        for station in stations
        if station["numero_estacion"]
    ]

    duplicate_oaci = sorted(
        {
            code
            for code in oaci_codes
            if oaci_codes.count(code) > 1
        }
    )

    duplicate_numbers = sorted(
        {
            number
            for number in station_numbers
            if station_numbers.count(number) > 1
        }
    )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    output_path.write_text(
        json.dumps(
            stations,
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )

    print()
    print("Normalización SMN finalizada")
    print("---------------------------")
    print(f"Registros: {len(stations)}")
    print(f"Errores: {len(errors)}")
    print(f"OACI duplicados: {len(duplicate_oaci)}")
    print(
        f"Nros. estación duplicados: "
        f"{len(duplicate_numbers)}"
    )

    if duplicate_oaci:
        print()
        print("OACI duplicados:")
        for code in duplicate_oaci:
            print(f"  - {code}")

    if duplicate_numbers:
        print()
        print("Números de estación duplicados:")
        for number in duplicate_numbers:
            print(f"  - {number}")

    if errors:
        print()
        print("Errores encontrados:")

        for error in errors:
            print(f"  - {error}")

    print()
    print(f"Salida: {output_path}")

    if stations:
        print()
        print("Primer registro:")
        print(
            json.dumps(
                stations[0],
                ensure_ascii=False,
                indent=2
            )
        )


if __name__ == "__main__":
    main()
