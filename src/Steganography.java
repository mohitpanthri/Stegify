import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

public class Steganography {

    public static void hideMessageInImage(String imagePath, String message) {
        try {
            // Load the image file
            BufferedImage image = ImageIO.read(new File(imagePath));

            // Get the image dimensions
            int width = image.getWidth();
            int height = image.getHeight();

            // Convert the message to binary
            String binaryMessage = stringToBinary(message);

            // Make sure the message will fit in the image
            int maxMessageLength = (width * height * 3) / 8;
            if (binaryMessage.length() > maxMessageLength) {
                throw new RuntimeException("Message is too long to fit in image");
            }

            // Convert the binary message to an array of bytes
            byte[] messageBytes = binaryToBytes(binaryMessage);

            // Hide the message in the image
            int byteIndex = 0;
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    if (byteIndex < messageBytes.length) {
                        int pixel = image.getRGB(x, y);
                        int r = (pixel >> 16) & 0xFF;
                        int g = (pixel >> 8) & 0xFF;
                        int b = pixel & 0xFF;
                        r = (r & 0xFE) | ((messageBytes[byteIndex] >> 7) & 0x01);
                        g = (g & 0xFE) | ((messageBytes[byteIndex] >> 6) & 0x01);
                        b = (b & 0xFE) | ((messageBytes[byteIndex] >> 5) & 0x01);
                        int newPixel = (r << 16) | (g << 8) | b;
                        image.setRGB(x, y, newPixel);
                        byteIndex++;
                    }
                }
            }

            // Write the modified image to disk
            File outputImageFile = new File("output.png");
            ImageIO.write(image, "png", outputImageFile);
            System.out.println("Message hidden in image successfully");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String stringToBinary(String message) {
        StringBuilder binaryMessage = new StringBuilder();
        for (char c : message.toCharArray()) {
            String binary = Integer.toBinaryString(c);
            while (binary.length() < 8) {
                binary = "0" + binary;
            }
            binaryMessage.append(binary);
        }
        return binaryMessage.toString();
    }

    private static byte[] binaryToBytes(String binary) {
        byte[] bytes = new byte[binary.length() / 8];
        for (int i = 0; i < bytes.length; i++) {
            String byteString = binary.substring(i * 8, (i + 1) * 8);
            bytes[i] = (byte) Integer.parseInt(byteString, 2);
        }
        return bytes;
    }

    public static void main(String[] args) {
        try {
            String filepath = "M:\\Projects\\steganography-gh-pages\\stg\\proj\\Anime.png";

            hideMessageInImage(filepath, "Please work");
        } catch (Exception e) {
            System.err.println(e);
        }

    }

}
