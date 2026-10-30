import json
import re
import sys
import tempfile
import zipfile
from pathlib import Path

import shapefile


def normalize_text(value):
    if value is None:
        return None

    text = str(value).strip()

    if text == "":
        return None

    return text


def parse_number(value):
    if value is None:
        return None

    text = str(value).strip()

    if not text:
        return None

    match = re.search(
        r"-?\d+(?:[.,]\d+)?",
        text,
    )

    if not match:
        return None

    try:
        return float(
            match.group(0).replace(",", ".")
        )

    except ValueError:
        return None


def parse_coordinate(value):
    if value is None:
        return None

    try:
        number = float(
            str(value)
            .strip()
            .replace(",", ".")
        )

    except ValueError:
        return None

    #
    # Algunos registros del dataset ANAC tienen
    # perdido el punto decimal:
    #
    # -64415 -> -64.415
    # -34315 -> -34.315
    #
    if abs(number) > 180:
        while abs(number) > 180:
            number /= 10

    return number


def validate_argentina_coordinates(lat, lon):
    if lat is None or lon is None:
        return False

    #
    # Incluye territorio continental y Antártida Argentina.
    #
    if not (-90 <= lat <= -20):
        return False

    #
    # Rango razonable para las longitudes presentes
    # en el dataset argentino.
    #
    if not (-80 <= lon <= -40):
        return False

    return True


def parse_reference_point(value):
    """
    Convierte coordenadas ANAC como:

        315258S 0615036W

    en:

        lat = -31.8827778
        lon = -61.8433333
    """

    if not value:
        return None, None

    text = str(value).strip().upper()

    #
    # Formato esperado:
    #
    # DDMMSSS DDDMMSSW
    #
    match = re.search(
        r"(\d{2})(\d{2})(\d{2})S\s+"
        r"(\d{3})(\d{2})(\d{2})W",
        text,
    )

    if not match:
        return None, None

    lat_deg = int(match.group(1))
    lat_min = int(match.group(2))
    lat_sec = int(match.group(3))

    lon_deg = int(match.group(4))
    lon_min = int(match.group(5))
    lon_sec = int(match.group(6))

    lat = -(
        lat_deg
        + lat_min / 60
        + lat_sec / 3600
    )

    lon = -(
        lon_deg
        + lon_min / 60
        + lon_sec / 3600
    )

    return lat, lon


def detect_encoding(base_directory, shp_path):
    """
    Intenta detectar el encoding informado por el dataset.

    El archivo ANAC utilizado viene en ISO-8859-1.
    """

    base_directory = Path(base_directory)
    shp_path = Path(shp_path)

    stem = shp_path.stem

    possible_files = [
        base_directory / f"{stem}.cpg",
        base_directory / f"{stem}.CPG",
        base_directory / f"{stem}.cst",
        base_directory / f"{stem}.CST",
    ]

    for path in possible_files:
        if not path.exists():
            continue

        try:
            value = path.read_text(
                encoding="ascii",
                errors="ignore",
            ).strip()

            if value:
                normalized = value.lower()

                if (
                    "8859" in normalized
                    or "latin" in normalized
                ):
                    return "iso-8859-1"

                if "utf" in normalized:
                    return "utf-8"

        except Exception:
            pass

    return "iso-8859-1"


def choose(fields, candidates):
    """
    Busca un nombre de campo tolerando diferencias
    de mayúsculas/minúsculas y espacios.
    """

    normalized = {
        str(field).strip().lower(): field
        for field in fields
    }

    for candidate in candidates:
        key = candidate.strip().lower()

        if key in normalized:
            return normalized[key]

    return None


def find_shapefile(directory):
    files = list(
        Path(directory).rglob("*.shp")
    )

    if not files:
        raise RuntimeError(
            "No se encontró ningún archivo .shp "
            "dentro del ZIP."
        )

    if len(files) > 1:
        print(
            "Se encontraron varios SHP. "
            f"Se utilizará: {files[0]}"
        )

    return files[0]


def main(zip_path, output_path):
    source = Path(zip_path)
    out = Path(output_path)

    if not source.exists():
        raise SystemExit(
            f"No existe el archivo: {source}"
        )

    if not zipfile.is_zipfile(source):
        raise SystemExit(
            f"El archivo no es un ZIP válido: {source}"
        )

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)

        with zipfile.ZipFile(source, "r") as archive:
            archive.extractall(tmp_path)

        shp_path = find_shapefile(tmp_path)

        encoding = detect_encoding(
            shp_path.parent,
            shp_path,
        )

        print(
            f"Shapefile: {shp_path.name}"
        )

        print(
            f"Encoding: {encoding}"
        )

        reader = shapefile.Reader(
            str(shp_path),
            encoding=encoding,
        )

        #
        # pyshp incluye el campo técnico
        # DeletionFlag en fields[0].
        #
        fields = [
            field[0]
            for field in reader.fields[1:]
        ]

        print()
        print("Campos detectados:")

        for field in fields:
            print(f"  - {field}")

        #
        # Mapping real del dataset
        # Aeródromos y helipuertos ANAC
        # septiembre 2026.
        #
        mapping = {
            "nombre": choose(
                fields,
                ["denominaci", "denominacion"],
            ),
            "designador_oaci": choose(
                fields,
                [
                    "código oa",
                    "codigo oa",
                    "codigo_oaci",
                ],
            ),
            "designador_iata": choose(
                fields,
                [
                    "codigo iat",
                    "codigo_iata",
                ],
            ),
            "designador_local": choose(
                fields,
                [
                    "trigrama a",
                    "trigrama",
                ],
            ),
            "tipo": choose(
                fields,
                ["tipo"],
            ),
            "localidad": None,
            "provincia": choose(
                fields,
                ["provincia"],
            ),
            "elevacion_m": choose(
                fields,
                [
                    "elevación",
                    "elevacion",
                ],
            ),
            "uso": choose(
                fields,
                ["trafico", "tráfico"],
            ),
        }

        print()
        print("Mapping:")

        for target, source_field in mapping.items():
            print(
                f"  {target}: "
                f"{source_field or '-'}"
            )

        features = []

        missing_geometry = 0
        corrected_reference = 0
        corrected_shp = 0
        suspicious = []

        for index, shape_record in enumerate(
            reader.iterShapeRecords()
        ):
            raw = dict(
                zip(
                    fields,
                    shape_record.record,
                )
            )

            properties = {
                "source_id": str(
                    raw.get("id")
                    or raw.get("ID")
                    or index
                )
            }

            for target, source_field in mapping.items():
                value = (
                    raw.get(source_field)
                    if source_field
                    else None
                )

                if target == "elevacion_m":
                    value = parse_number(value)

                elif target in {
                    "nombre",
                    "designador_oaci",
                    "designador_iata",
                    "designador_local",
                    "tipo",
                    "localidad",
                    "provincia",
                    "uso",
                }:
                    value = normalize_text(value)

                properties[target] = value

            #
            # Conservamos todo el registro original.
            #
            properties["_raw"] = raw

            #
            # Coordenadas explícitas del dataset.
            #
            lat_field = choose(
                fields,
                ["lat", "latitud"],
            )

            lon_field = choose(
                fields,
                ["lon", "longitud", "lng"],
            )

            lat = (
                parse_coordinate(
                    raw.get(lat_field)
                )
                if lat_field
                else None
            )

            lon = (
                parse_coordinate(
                    raw.get(lon_field)
                )
                if lon_field
                else None
            )

            coordinates_valid = (
                validate_argentina_coordinates(
                    lat,
                    lon,
                )
            )

            #
            # Primer fallback:
            # campo punto de referencia ANAC.
            #
            if not coordinates_valid:
                reference_field = choose(
                    fields,
                    [
                        "punto de r",
                        "punto de referencia",
                    ],
                )

                reference_value = (
                    raw.get(reference_field)
                    if reference_field
                    else None
                )

                reference_lat, reference_lon = (
                    parse_reference_point(
                        reference_value
                    )
                )

                if validate_argentina_coordinates(
                    reference_lat,
                    reference_lon,
                ):
                    lat = reference_lat
                    lon = reference_lon

                    coordinates_valid = True
                    corrected_reference += 1

            #
            # Segundo fallback:
            # geometría SHP.
            #
            if (
                not coordinates_valid
                and shape_record.shape.points
            ):
                x, y = (
                    shape_record.shape.points[0]
                )

                shp_lon = parse_coordinate(x)
                shp_lat = parse_coordinate(y)

                if validate_argentina_coordinates(
                    shp_lat,
                    shp_lon,
                ):
                    lat = shp_lat
                    lon = shp_lon

                    coordinates_valid = True
                    corrected_shp += 1

            geometry = None

            if coordinates_valid:
                geometry = {
                    "type": "Point",
                    "coordinates": [
                        lon,
                        lat,
                    ],
                }

            else:
                missing_geometry += 1

                suspicious.append(
                    {
                        "source_id": properties[
                            "source_id"
                        ],
                        "nombre": properties.get(
                            "nombre"
                        ),
                        "lat": lat,
                        "lon": lon,
                    }
                )

            features.append(
                {
                    "type": "Feature",
                    "geometry": geometry,
                    "properties": properties,
                }
            )

        output = {
            "type": "FeatureCollection",
            "features": features,
        }

        out.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        out.write_text(
            json.dumps(
                output,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

        #
        # Validaciones.
        #
        source_ids = [
            feature["properties"]["source_id"]
            for feature in features
        ]

        duplicated_ids = sorted(
            {
                source_id
                for source_id in source_ids
                if source_ids.count(source_id) > 1
            }
        )

        print()
        print(
            f"GeoJSON escrito: {out}"
        )

        print(
            f"Registros: {len(features)}"
        )

        print(
            f"Sin geometría: {missing_geometry}"
        )

        print(
            "Corregidos desde punto de referencia: "
            f"{corrected_reference}"
        )

        print(
            "Corregidos desde geometría SHP: "
            f"{corrected_shp}"
        )

        print(
            "Source ID duplicados: "
            f"{len(duplicated_ids)}"
        )

        if duplicated_ids:
            print()
            print("IDs duplicados:")

            for source_id in duplicated_ids:
                print(
                    f"  - {source_id}"
                )

        if suspicious:
            print()
            print(
                "Registros sin coordenadas válidas:"
            )

            for item in suspicious:
                print(
                    f"  - {item['source_id']} | "
                    f"{item['nombre']} | "
                    f"lat={item['lat']} | "
                    f"lon={item['lon']}"
                )


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(
            "Uso: "
            "python tools/inspect_anac_shapefile.py "
            "origen.zip salida.geojson"
        )

    main(
        sys.argv[1],
        sys.argv[2],
    )
