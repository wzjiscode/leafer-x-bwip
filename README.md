# Leafer X BWIP Plugin

## Usage Instructions
To use the @wzjiscode/leafer-x-bwip plugin in your Leafer project, follow these steps:

1. Install the package:
   ```bash
   npm install @wzjiscode/leafer-x-bwip
   ```

2. Import and register the plugin in your application:
   ```javascript
   import leafer from 'leafer-ui';
   import register from '@wzjiscode/leafer-x-bwip';

   register(leafer);
   ```

3. You can now use the Bwip node in your Leafer components.
   ```javascript
   <Bwip bwip={{ bcid: 'code128', text: 'Hello World!' }} />
   ```