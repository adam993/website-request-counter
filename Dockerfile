FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copy project files
COPY . .

EXPOSE 4321

CMD ["yarn", "dev", "--host", "0.0.0.0"]
