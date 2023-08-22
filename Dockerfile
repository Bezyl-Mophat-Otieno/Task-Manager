# Use the official nginx image as the base image
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm -rf /etc/nginx/conf.d

# Copy your static files to the nginx document root
COPY . /usr/share/nginx/html

# Expose port 80 for nginx
EXPOSE 80

# Start nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
