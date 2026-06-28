# Expo Go & Docker Connection Methods

Here is how to configure and run the project under different developer workflows.

---

## Option 1: Adb Port Forwarding (Recommended for Emulators & USB Phones)
This method maps the emulator/device's local ports directly to your host ports.

1. **Docker Config:** In `docker-compose.yml`, set the package host to localhost:
   ```yaml
   environment:
     - REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1
   ```
2. **Launch Services:** Run `docker-compose up --build`
3. **Map Ports:** Run these commands on your host terminal:
   ```bash
   adb reverse tcp:8081 tcp:8081
   adb reverse tcp:5000 tcp:5000
   ```
4. **Run App:** Open the **Expo Go** app on the emulator/phone and enter:
   `exp://localhost:8081`

---

## Option 2: Emulator Native Loopback (No adb reverse)
Android emulators automatically route `10.0.2.2` to the host machine's localhost.

1. **Docker Config:** In `docker-compose.yml`, set:
   ```yaml
   environment:
     - REACT_NATIVE_PACKAGER_HOSTNAME=10.0.2.2
   ```
2. **Launch Services:** Run `docker-compose up --build`
3. **Run App:** Open **Expo Go** on the emulator and enter:
   `exp://10.0.2.2:8081`
   *(In your React Native fetch code, point your API calls to `http://10.0.2.2:5000`)*

---

## Option 3: Local LAN Network (For Wi-Fi Debugging on Physical Phones)
Ideal for testing on a physical phone connected to the same Wi-Fi network.

1. **Get Host LAN IP:** Find your local IP address (e.g. run `ipconfig` on Windows, look for IPv4 Address like `192.168.1.59`).
2. **Docker Config:** In `docker-compose.yml`, set the package host to your LAN IP:
   ```yaml
   environment:
     - REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.59
   ```
3. **Launch Services:** Run `docker-compose up --build`
4. **Run App:** Open **Expo Go** on your phone, scan the QR code from the Docker container logs, or manually type:
   `exp://192.168.1.59:8081`

---

## Option 4: No Docker (Metro Packager running on Host)
If you prefer to run Metro outside of Docker for better file-watching performance:

1. **Disable native container:** Comment out the `native` service in `docker-compose.yml`.
2. **Launch Backend:** Run `docker-compose up --build` (starts only Mongo, Node API, and C++ server).
3. **Map API Port:** Run `adb reverse tcp:5000 tcp:5000`
4. **Launch Metro:** In a new terminal on your host:
   ```bash
   cd native-react
   npx expo start
   ```
5. **Run App:** Press `a` in your terminal to open it in your emulator, or scan the QR code on your phone.
