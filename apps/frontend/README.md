# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment with Nginx

To deploy this application with Nginx, follow these steps:

1. Build the project for production:
```bash
npm run build
```

2. Install Nginx on your server if not already installed:
```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install nginx

# For CentOS/RHEL
sudo yum install nginx
```

3. Copy the nginx configuration:
```bash
sudo cp nginx.conf /etc/nginx/conf.d/your-app.conf
```

4. Copy the built files to Nginx's serve directory:
```bash
sudo cp -r dist/* /usr/share/nginx/html/
```

5. Test Nginx configuration:
```bash
sudo nginx -t
```

6. Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Important Notes

- Make sure to replace `your-domain.com` in the nginx.conf with your actual domain name
- The configuration includes:
  - Gzip compression for better performance
  - Cache control for static assets
  - SPA routing support
  - Basic security headers
- SSL/HTTPS is not included in this configuration. For production, you should add SSL using Let's Encrypt or your preferred SSL provider
- Ensure proper file permissions are set on the served directory
