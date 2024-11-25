FROM node:20.11.1

# Install the latest Chrome dev package and necessary fonts and libraries
RUN apt-get update && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
      fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf \
      libxss1 dbus dbus-x11 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 libxrandr2 libgbm1 \
      libpango1.0-0 libasound2 libwayland-client0 libwayland-cursor0 libwayland-egl1 xdg-utils \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \

# Verify the installation of google-chrome-stable
RUN which google-chrome-stable || true

# Update apt-get and install xvfb separately for diagnostics
RUN apt-get update && apt-get install -y xvfb --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


# Set the working directory
WORKDIR /home/apify

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Puppeteer without downloading bundled Chromium
RUN npm install puppeteer-core --no-save

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
    DISPLAY=:99

# Copy the rest of the application code
COPY . .

# Expose port and set start command
EXPOSE 8000

# Start Xvfb and run the application
CMD ["sh", "-c", "Xvfb :99 -screen 0 1024x768x16 & npm start"]
