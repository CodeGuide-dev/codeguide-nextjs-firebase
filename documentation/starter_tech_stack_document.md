# Tech Stack

This starter kit uses the following tech stack:

1. **Core Framework and Runtime:**

   - **Next.js 14.2.23**: The main framework used for building the application, providing server-side rendering, routing, and API capabilities
     - Core Next.js configuration in `next.config.mjs`
     - API routes in `app/api/` directory
     - Middleware configuration in `middleware.ts`
   - **React 18**: The underlying UI library for building components
     - Components directory: `components/`
     - Hooks directory: `hooks/`
   - **TypeScript**: Used for type-safe development
     - Types directory: `types/`
     - Configuration in `tsconfig.json`

2. **Authentication and User Management:**

   - **Clerk**: Implemented via `@clerk/nextjs` for handling authentication and user management
     - Middleware configuration in `middleware.ts`
     - Provider configuration in `components/providers/clerk-client-provider.tsx`. Add provider to `app/layout.tsx` to start using clerk

3. **Database and Backend:**

   - **Firebase**: Used as the main database and backend service
     - Client implementation: `utils/firebase/client.ts`
     - Configuration: `utils/firebase/config.ts`
     - Example usage with React Query:

       ```typescript
       // hooks/use-products.ts
       import { useQuery } from '@tanstack/react-query'
       import { collection, getDocs } from 'firebase/firestore'
       import { db } from '@/utils/firebase/client'

       export function useProducts() {
         return useQuery({
           queryKey: ['products'],
           queryFn: async () => {
             const productsRef = collection(db, 'products')
             const snapshot = await getDocs(productsRef)
             return snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
             }))
           },
         })
       }
       ```

4. **Data Fetching and State Management:**

   - **TanStack React Query**: For efficient server state management and data fetching
     - Provider configuration: `components/providers/tanstack-client-provider.tsx`
     - Add provider to `app/layout.tsx` to enable React Query throughout the app
     - Example mutation hook structure:

       ```typescript
       // hooks/use-create-product.ts
       import { useMutation, useQueryClient } from '@tanstack/react-query'
       import { collection, addDoc } from 'firebase/firestore'
       import { db } from '@/utils/firebase/client'

       export function useCreateProduct() {
         const queryClient = useQueryClient()

         return useMutation({
           mutationFn: async (productData) => {
             const productsRef = collection(db, 'products')
             const docRef = await addDoc(productsRef, productData)
             return { id: docRef.id, ...productData }
           },
           onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['products'] })
           },
         })
       }
       ```

5. **UI Components and Styling:**

   - **shadcn/ui**: Beautifully designed components made with Tailwind CSS and Radix UI
     - Configuration: `components.json`
   - **Radix UI**: Extensive use of accessible components including:
     - Dialog, Popover, Tooltip
     - Navigation menus
     - Form elements (Checkbox, Radio, Select)
     - Layout components (Accordion, Tabs)
   - **Tailwind CSS**: For styling with utility classes
     - Configuration: `tailwind.config.ts`
     - PostCSS configuration: `postcss.config.mjs`
     - Uses `tailwindcss-animate` for animations
   - **Framer Motion**: For advanced animations
   - **Lucide React**: For icons
   - **Embla Carousel**: For carousel/slider components
   - **Sonner**: For toast notifications
   - **class-variance-authority**: For managing component variants
   - **clsx** and **tailwind-merge**: For conditional class name handling

6. **Form Handling and Validation:**

   - **React Hook Form**: For form management
   - **Zod**: For schema validation
   - **@hookform/resolvers**: For integrating Zod with React Hook Form

7. **Date Handling and Charts:**

   - **date-fns**: For date manipulation
   - **React Day Picker**: For date picking components
   - **Recharts**: For data visualization and charts

8. **Development Tools:**

   - **ESLint**: For code linting
     - Configuration: `.eslintrc.json`
   - **Prettier**: For code formatting with Tailwind plugin
     - Configuration: `.prettierrc`
   - **TypeScript**: For static type checking
   - **PostCSS**: For CSS processing

9. **UI/UX Features:**

   - **next-themes**: For dark/light theme switching
   - **react-resizable-panels**: For resizable layout panels
   - **vaul**: For additional UI components
   - **cmdk**: For command palette functionality

10. **AI Integration:**

    - OpenAI implementation: `utils/ai/openai.ts`

11. **Helper Utilities:**
    - General helpers: `utils/helpers.ts`

The project is set up as a modern web application with:

- Secure authentication
- Type-safe development
- Modern UI components
- Responsive design
- Server-side rendering capabilities
- API routes for backend functionality
- Real-time database capabilities with Firebase
- AI integration capabilities

This tech stack provides a robust foundation for building a scalable, secure, and user-friendly web application with all the modern features expected in a professional product.
