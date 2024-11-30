import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe("pk_test_51PXdbsKsLOwdkUkUL1e78Ki8NUsVxOat3zMA6SYNejFFPbJ7qHTKJzve2NeZBkrp32MydGnzbJrWHclsOCnUtivt00xfBi2Jgh");

export default stripePromise;