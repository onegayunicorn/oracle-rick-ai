import sys
import argparse
from .client import FishVoiceClient
from .exceptions import FishVoiceError


def main():
    p = argparse.ArgumentParser(prog="rick-tts", description="Rick Sanchez TTS CLI")
    p.add_argument("text", nargs="?", help="Text to speak")
    p.add_argument("-o", "--output", default="output.mp3", help="Output audio file")
    p.add_argument("--voice-id", default=None)
    p.add_argument("--model", default=None)
    p.add_argument("--list-voices", action="store_true", help="List available voices")
    args = p.parse_args()

    try:
        client = FishVoiceClient()
        if args.list_voices:
            import json
            print(json.dumps(client.list_voices(), indent=2))
            return
        if not args.text:
            p.error("text is required (or use --list-voices)")
        client.synthesize_to_file(
            args.text, args.output,
            voice_id=args.voice_id, model=args.model,
        )
        print(f"[OK] Saved to {args.output}")
    except FishVoiceError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
