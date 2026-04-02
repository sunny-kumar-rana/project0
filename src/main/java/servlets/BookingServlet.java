package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@WebServlet("/bookings")
public class BookingServlet extends HttpServlet {

    private static final List<Map<String, Object>> bookings = new ArrayList<>();


    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String user = (String) request.getSession().getAttribute("userEmail");

        if (user == null) {
            response.setStatus(401);
            return;
        }

        response.setContentType("application/json");
        response.getWriter().write(new JSONArray(bookings).toString());
    }


    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String user = (String) request.getSession().getAttribute("userEmail");

        if (user == null) {
            response.setStatus(401);
            return;
        }

        BufferedReader reader = request.getReader();
        String body = reader.lines().collect(Collectors.joining());

        JSONObject json = new JSONObject(body);

        Map<String, Object> booking = new HashMap<>();
        booking.put("id", System.currentTimeMillis());
        booking.put("userId", user);
        booking.put("serviceId", json.getLong("serviceId"));
        booking.put("status", "pending");

        bookings.add(booking);

        response.setStatus(200);
    }

    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        BufferedReader reader = request.getReader();
        String body = reader.lines().collect(Collectors.joining());

        JSONObject json = new JSONObject(body);

        long id = json.getLong("id");
        String status = json.getString("status");

        for (Map<String, Object> b : bookings) {
            if ((long) b.get("id") == id) {
                b.put("status", status);
                break;
            }
        }

        response.setStatus(200);
    }
}
